import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please provide a valid work email address."),
  role: z.enum(["developer", "designer", "manager", "analyst"]),
  weeklyDigest: z.boolean().default(true),
  acceptTerms: z.boolean().refine((v) => v === true, {
    message: "You must accept the workspace policy to continue.",
  }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
