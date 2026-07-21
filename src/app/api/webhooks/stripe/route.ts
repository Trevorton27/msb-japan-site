import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency: skip already-processed events
  const existing = await db.stripeEvent.findUnique({
    where: { stripeEventId: event.id },
  });
  if (existing?.processed) {
    return NextResponse.json({ received: true });
  }

  // Record the event
  await db.stripeEvent.upsert({
    where: { stripeEventId: event.id },
    create: { stripeEventId: event.id, type: event.type, processed: false },
    update: {},
  });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.type === "donation") {
          await db.donation.updateMany({
            where: { stripeSessionId: session.id },
            data: {
              status: "COMPLETED",
              stripeSubscriptionId:
                session.mode === "subscription"
                  ? (session.subscription as string) ?? null
                  : null,
            },
          });
        } else if (session.metadata?.type === "order") {
          await db.order.updateMany({
            where: { stripeSessionId: session.id },
            data: { status: "PAID" },
          });
          // Decrement stock for each order item
          const order = await db.order.findFirst({
            where: { stripeSessionId: session.id },
            include: { items: true },
          });
          if (order) {
            for (const item of order.items) {
              await db.productVariant.update({
                where: { id: item.variantId },
                data: { stockQuantity: { decrement: item.quantity } },
              });
            }
            // Clear the cart
            const cartSessionId = session.metadata?.cartSessionId;
            if (cartSessionId) {
              await db.cartItem.deleteMany({
                where: { cart: { sessionId: cartSessionId } },
              });
            }
          }
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.type === "donation") {
          await db.donation.updateMany({
            where: { stripeSessionId: session.id, status: "PENDING" },
            data: { status: "FAILED" },
          });
        } else if (session.metadata?.type === "order") {
          await db.order.updateMany({
            where: { stripeSessionId: session.id, status: "PENDING" },
            data: { status: "CANCELLED" },
          });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntent = charge.payment_intent as string | null;
        if (paymentIntent) {
          const sessions = await getStripe().checkout.sessions.list({
            payment_intent: paymentIntent,
            limit: 1,
          });
          const session = sessions.data[0];
          if (session?.metadata?.type === "donation") {
            await db.donation.updateMany({
              where: { stripeSessionId: session.id },
              data: { status: "REFUNDED" },
            });
          } else if (session?.metadata?.type === "order") {
            await db.order.updateMany({
              where: { stripeSessionId: session.id },
              data: { status: "REFUNDED" },
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await db.donation.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { recurring: false },
        });
        break;
      }
    }

    // Mark event as processed
    await db.stripeEvent.update({
      where: { stripeEventId: event.id },
      data: { processed: true },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
