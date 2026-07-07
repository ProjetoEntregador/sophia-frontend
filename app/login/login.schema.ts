import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Preencha seu e-mail."),
  password: z.string().min(1, "Preencha sua senha."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
