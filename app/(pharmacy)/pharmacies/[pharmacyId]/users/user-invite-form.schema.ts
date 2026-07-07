import { z } from "zod";

export const userInviteFormSchema = z.object({
  email: z.email("Enter a valid email address."),
  role: z.enum(["staff"], {
    error: "Select a valid pharmacy role.",
  }),
});

export type UserInviteFormValues = z.infer<typeof userInviteFormSchema>;
