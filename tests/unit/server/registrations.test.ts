import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma } from "@prisma/client";

const tx = {
  event: { findUnique: vi.fn() },
  eventRegistration: { count: vi.fn(), create: vi.fn() },
};

const transaction = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    $transaction: (...args: unknown[]) => transaction(...args),
  },
}));

const { registerForEvent } = await import("@/server/actions/registrations");

const validData = {
  email: "student@example.com",
  attendees: [{ nameJa: "田中太郎" }],
};

function publishedEvent(capacity: number | null) {
  return { status: "PUBLISHED", capacity, registrationClosesAt: null };
}

beforeEach(() => {
  vi.clearAllMocks();
  // Default: run the callback against the mock tx client.
  transaction.mockImplementation(
    (fn: (client: typeof tx) => Promise<unknown>) => fn(tx)
  );
  tx.eventRegistration.create.mockImplementation(
    ({ data }: { data: { status: string } }) => ({
      id: "reg_1",
      status: data.status,
    })
  );
});

describe("registerForEvent", () => {
  it("confirms a registration when the event is under capacity", async () => {
    tx.event.findUnique.mockResolvedValue(publishedEvent(20));
    tx.eventRegistration.count.mockResolvedValue(5);

    const result = await registerForEvent("evt_1", validData);

    expect(result).toMatchObject({ success: true, status: "CONFIRMED" });
  });

  it("waitlists a registration when the event is exactly at capacity", async () => {
    tx.event.findUnique.mockResolvedValue(publishedEvent(15));
    tx.eventRegistration.count.mockResolvedValue(15);

    const result = await registerForEvent("evt_1", validData);

    expect(result).toMatchObject({ success: true, status: "WAITLISTED" });
  });

  it("confirms registrations for events with no capacity limit", async () => {
    tx.event.findUnique.mockResolvedValue(publishedEvent(null));
    tx.eventRegistration.count.mockResolvedValue(500);

    const result = await registerForEvent("evt_1", validData);

    expect(result).toMatchObject({ success: true, status: "CONFIRMED" });
  });

  it("counts the capacity inside the transaction so concurrent writes cannot overbook", async () => {
    tx.event.findUnique.mockResolvedValue(publishedEvent(15));
    tx.eventRegistration.count.mockResolvedValue(14);

    await registerForEvent("evt_1", validData);

    expect(transaction).toHaveBeenCalledWith(expect.any(Function), {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
    expect(tx.eventRegistration.count).toHaveBeenCalledWith({
      where: { eventId: "evt_1", status: { in: ["PENDING", "CONFIRMED"] } },
    });
  });

  it("retries once when the transaction hits a serialization conflict", async () => {
    tx.event.findUnique.mockResolvedValue(publishedEvent(15));
    tx.eventRegistration.count.mockResolvedValue(15);

    const conflict = new Prisma.PrismaClientKnownRequestError(
      "write conflict",
      { code: "P2034", clientVersion: "7.9.0" }
    );
    transaction
      .mockImplementationOnce(() => Promise.reject(conflict))
      .mockImplementationOnce((fn: (client: typeof tx) => Promise<unknown>) =>
        fn(tx)
      );

    const result = await registerForEvent("evt_1", validData);

    expect(transaction).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({ success: true, status: "WAITLISTED" });
  });

  it("rejects registration for an unpublished event", async () => {
    tx.event.findUnique.mockResolvedValue({
      status: "DRAFT",
      capacity: 20,
      registrationClosesAt: null,
    });

    const result = await registerForEvent("evt_1", validData);

    expect(result.success).toBe(false);
    expect(tx.eventRegistration.create).not.toHaveBeenCalled();
  });

  it("rejects registration after the close date", async () => {
    tx.event.findUnique.mockResolvedValue({
      status: "PUBLISHED",
      capacity: 20,
      registrationClosesAt: new Date("2020-01-01"),
    });

    const result = await registerForEvent("evt_1", validData);

    expect(result.success).toBe(false);
    expect(tx.eventRegistration.create).not.toHaveBeenCalled();
  });
});
