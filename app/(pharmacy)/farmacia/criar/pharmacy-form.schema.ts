import { z } from "zod";

export const pharmacyFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, "Preencha o nome da farmácia.")
    .max(100, "O nome da farmácia deve ter entre 5 e 100 caracteres"),
  phone: z
    .string()
    .trim()
    .min(1, "Preencha o telefone da farmácia.")
    .refine(
      (value) => value.replace(/\D/g, "").length === 11,
      "Informe um telefone válido no formato (00) 00000-0000.",
    ),
  address: z.string().trim().min(1, "Preencha o endereço da farmácia."),
  city: z.string().trim().min(1, "Preencha a cidade onde a farmácia reside."),
});

export type PharmacyFormValues = z.infer<typeof pharmacyFormSchema>;
