import { describe, it, expect } from "vitest";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

describe("ANALYTICS_EVENTS", () => {
  it("defines all expected event types", () => {
    expect(ANALYTICS_EVENTS.PAGE_VIEW).toBe("page_view");
    expect(ANALYTICS_EVENTS.DONATION_STARTED).toBe("donation_started");
    expect(ANALYTICS_EVENTS.DONATION_COMPLETED).toBe("donation_completed");
    expect(ANALYTICS_EVENTS.EVENT_REGISTRATION).toBe("event_registration");
    expect(ANALYTICS_EVENTS.CONTACT_FORM_SUBMITTED).toBe("contact_form_submitted");
    expect(ANALYTICS_EVENTS.NEWSLETTER_SIGNUP).toBe("newsletter_signup");
    expect(ANALYTICS_EVENTS.PRODUCT_VIEWED).toBe("product_viewed");
    expect(ANALYTICS_EVENTS.ADD_TO_CART).toBe("add_to_cart");
    expect(ANALYTICS_EVENTS.CHECKOUT_STARTED).toBe("checkout_started");
    expect(ANALYTICS_EVENTS.ORDER_COMPLETED).toBe("order_completed");
    expect(ANALYTICS_EVENTS.SOCIAL_POST_PUBLISHED).toBe("social_post_published");
  });

  it("has unique event names", () => {
    const values = Object.values(ANALYTICS_EVENTS);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });
});
