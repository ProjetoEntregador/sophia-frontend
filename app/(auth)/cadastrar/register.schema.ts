import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Preencha seu nome completo."),
    email: z.email("Preencha seu e-mail."),
    password: z
      .string()
      .min(8, "Sua senha deve conter pelo menos 8 caracteres.")
      .regex(/[A-Z]/, "Sua senha deve conter pelo menos uma letra maiúscula.")
      .regex(/[a-z]/, "Sua senha deve conter pelo menos uma letra minúscula.")
      .regex(/[0-9]/, "Sua senha deve conter pelo menos um número."),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Suas senhas não batem.",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
