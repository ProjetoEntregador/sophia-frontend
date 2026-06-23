import { z } from "zod";

export const medicineFormSchema = z.object({
  name: z.string().trim().min(1, "Preencha o nome do medicamento."),
  dosage: z.string().trim().min(1, "Preencha a dosagem do medicamento."),
  pharmaceuticalForm: z
    .string()
    .trim()
    .min(1, "Preencha a fórmula farmacêutica medicamento."),
  manufacturer: z
    .string()
    .trim()
    .min(1, "Preencha o fabricante do medicamento."),
  description: z
    .string()
    .trim()
    .max(300, "A descrição deve ter menos de 300 caracteres.")
    .optional()
    .or(z.literal("")),
  stripe: z.string().trim().max(50, "A tarja deve ter menos de 50 caracteres."),
  unitPrice: z
    .string()
    .trim()
    .min(1, "Preencha o preço do medicamento.")
    .refine((value) => /^\d+([.,]\d{1,2})?$/.test(value), {
      message: "Formato do preço inválido",
    }),
  prescriptionRequired: z.boolean(),
});

export type MedicineFormValues = z.infer<typeof medicineFormSchema>;
