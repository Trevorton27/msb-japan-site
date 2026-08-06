import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! });

const defaultSender = {
  email: process.env.BREVO_SENDER_EMAIL!,
  name: process.env.BREVO_SENDER_NAME!,
};

interface SendEmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  sender?: { email: string; name: string };
  replyTo?: { email: string; name?: string };
  params?: Record<string, string>;
  tags?: string[];
}

interface SendTemplateEmailOptions {
  to: { email: string; name?: string }[];
  templateId: number;
  params?: Record<string, string>;
  sender?: { email: string; name: string };
  replyTo?: { email: string; name?: string };
  tags?: string[];
}

export async function sendEmail(options: SendEmailOptions) {
  return brevo.transactionalEmails.sendTransacEmail({
    sender: options.sender ?? defaultSender,
    to: options.to,
    subject: options.subject,
    htmlContent: options.htmlContent,
    textContent: options.textContent,
    replyTo: options.replyTo,
    params: options.params,
    tags: options.tags,
  });
}

export async function sendTemplateEmail(options: SendTemplateEmailOptions) {
  return brevo.transactionalEmails.sendTransacEmail({
    sender: options.sender ?? defaultSender,
    to: options.to,
    templateId: options.templateId,
    params: options.params,
    replyTo: options.replyTo,
    tags: options.tags,
  });
}

// Pre-built email functions for common use cases

const ackEmailContent: Record<string, {
  subject: string;
  greeting: (name: string) => string;
  body: string;
  regards: string;
}> = {
  ja: {
    subject: "お問い合わせを受け付けました",
    greeting: (name) => `${name} 様`,
    body: "お問い合わせいただきありがとうございます。内容を確認の上、折り返しご連絡いたします。",
    regards: "敬具",
  },
  en: {
    subject: "We received your message",
    greeting: (name) => `Hi ${name},`,
    body: "Thank you for reaching out. We have received your message and will get back to you soon.",
    regards: "Best regards,",
  },
};

export async function sendContactFormNotification(
  formData: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  },
  adminEmail: string,
  locale: string = "en",
) {
  const subjectLine = formData.subject
    ? `Contact: ${formData.subject} (from ${formData.name})`
    : `New Contact Form Submission from ${formData.name}`;

  // Admin notification is always in English
  await sendEmail({
    to: [{ email: adminEmail }],
    subject: subjectLine,
    htmlContent: `
      <h2>New Contact Form Message</h2>
      <p><strong>From:</strong> ${formData.name} (${formData.email})</p>
      ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ""}
      ${formData.subject ? `<p><strong>Subject:</strong> ${formData.subject}</p>` : ""}
      <p><strong>Locale:</strong> ${locale}</p>
      <hr />
      <p>${formData.message.replace(/\n/g, "<br />")}</p>
    `,
    replyTo: { email: formData.email, name: formData.name },
    tags: ["contact-form"],
  });

  // Acknowledgment email in the user's language
  const ack = ackEmailContent[locale] ?? ackEmailContent["en"]!;

  await sendEmail({
    to: [{ email: formData.email, name: formData.name }],
    subject: ack.subject,
    htmlContent: `
      <p>${ack.greeting(formData.name)}</p>
      <p>${ack.body}</p>
      <br />
      <p>${ack.regards}</p>
      <p>${defaultSender.name}</p>
    `,
    tags: ["contact-form-ack"],
  });
}

export async function sendDonationStatusEmail(
  to: { email: string; name?: string },
  donation: { amount: string; currency: string; status: string },
) {
  await sendEmail({
    to: [to],
    subject: `Donation ${donation.status}: ${donation.currency} ${donation.amount}`,
    htmlContent: `
      <p>Hi${to.name ? ` ${to.name}` : ""},</p>
      <p>Your donation of <strong>${donation.currency} ${donation.amount}</strong> has been <strong>${donation.status}</strong>.</p>
      <p>Thank you for your generous support.</p>
      <br />
      <p>Best regards,</p>
      <p>${defaultSender.name}</p>
    `,
    tags: ["donation-status"],
  });
}

export async function sendOrderStatusEmail(
  to: { email: string; name?: string },
  order: { orderId: string; status: string; summary?: string },
) {
  await sendEmail({
    to: [to],
    subject: `Order ${order.orderId} - ${order.status}`,
    htmlContent: `
      <p>Hi${to.name ? ` ${to.name}` : ""},</p>
      <p>Your order <strong>#${order.orderId}</strong> status has been updated to: <strong>${order.status}</strong>.</p>
      ${order.summary ? `<p>${order.summary}</p>` : ""}
      <br />
      <p>Best regards,</p>
      <p>${defaultSender.name}</p>
    `,
    tags: ["order-status"],
  });
}
