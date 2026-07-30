import { z } from "zod";

// Unfilled inputs submit "" rather than undefined; treat that as absent so an
// optional field left blank does not fail format validation.
const blankAsUndefined = (schema: z.ZodString) =>
  z
    .literal("")
    .transform(() => undefined)
    .or(schema.optional());

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().max(200).optional(),
  body: z.string().min(1, "Message is required").max(5000),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
  locale: z.enum(["ja", "en"]).default("ja"),
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;

export const eventRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  attendees: z
    .array(
      z.object({
        nameJa: z.string().min(1, "Name is required"),
        nameEn: blankAsUndefined(z.string()),
        email: blankAsUndefined(z.string().email("Invalid email address")),
      })
    )
    .min(1),
  notes: blankAsUndefined(z.string().max(1000)),
});

export type EventRegistrationValues = z.infer<typeof eventRegistrationSchema>;

export const donationSchema = z.object({
  email: z.string().email("Invalid email address"),
  amount: z.number().int().positive().min(100),
  recurring: z.boolean().default(false),
  designation: z
    .enum(["GENERAL", "LIFE_RELEASE", "DRUPCHO"])
    .default("GENERAL"),
  donorName: blankAsUndefined(z.string().max(100)),
  message: blankAsUndefined(z.string().max(500)),
});

export type DonationValues = z.infer<typeof donationSchema>;
