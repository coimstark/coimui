import { z } from "zod";

export const showcaseFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid work email address."),
  organization: z.string().trim().min(2, "Organization name is required."),
  seatCount: z.number().int().min(1, "Must request at least 1 seat.").max(5000, "Max 5000 seats."),
  deploymentModel: z.enum(["cloud", "dedicated", "self-hosted"]),
  releaseWindow: z.enum(["immediate", "next-sprint", "quarterly"]),
  notes: z.string().max(400, "Keep notes under 400 characters.").default(""),
  agreeTerms: z.boolean().refine((v) => v === true, "Confirm policy acknowledgement to submit."),
});

export type ShowcaseFormSchema = typeof showcaseFormSchema;
