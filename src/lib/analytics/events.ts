export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  DONATION_STARTED: "donation_started",
  DONATION_COMPLETED: "donation_completed",
  EVENT_REGISTRATION: "event_registration",
  CONTACT_FORM_SUBMITTED: "contact_form_submitted",
  NEWSLETTER_SIGNUP: "newsletter_signup",
  PRODUCT_VIEWED: "product_viewed",
  ADD_TO_CART: "add_to_cart",
  CHECKOUT_STARTED: "checkout_started",
  ORDER_COMPLETED: "order_completed",
  SOCIAL_POST_PUBLISHED: "social_post_published",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
