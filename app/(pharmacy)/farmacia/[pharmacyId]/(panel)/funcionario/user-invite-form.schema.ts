import { z } from "zod";

export const userInviteFormSchema = z.object({
  email: z.email("Formato de e-mail inválido."),
});

export type UserInviteFormValues = z.infer<typeof userInviteFormSchema>;
