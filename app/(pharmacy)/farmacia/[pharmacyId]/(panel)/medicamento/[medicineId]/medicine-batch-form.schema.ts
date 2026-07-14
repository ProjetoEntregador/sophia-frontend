import { z } from "zod";

export const medicineBatchFormSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "Preencha o código do lote.")
      .max(40, "Código do lote deve ter no máximo 40 caracteres."),
    quantity: z
      .string()
      .trim()
      .min(1, "Preencha a quantidade de unidades no lote.")
      .refine((value) => /^\d+$/.test(value) && Number(value) > 0, {
        message: "Valor deve ser um inteiro maior que zero.",
      }),
    expiresOn: z.string().min(1, "Preencha a data de expiração."),
  })
  .refine(({ expiresOn }) => Number.isFinite(Date.parse(expiresOn)), {
    message: "Data de expiração inválida.",
    path: ["expiresOn"],
  });

export type MedicineBatchFormValues = z.infer<typeof medicineBatchFormSchema>;
