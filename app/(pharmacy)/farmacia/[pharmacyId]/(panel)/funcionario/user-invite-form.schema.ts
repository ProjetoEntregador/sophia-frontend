import { z } from "zod";

export const userInviteFormSchema = z.object({
  email: z.email("Enter a valid email address."),
});

export type UserInviteFormValues = z.infer<typeof userInviteFormSchema>;
