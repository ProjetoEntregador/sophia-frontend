import { z } from "zod";

export const medicineBatchFormSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "Enter the batch code.")
      .max(40, "Batch code must have at most 40 characters."),
    quantity: z
      .string()
      .trim()
      .min(1, "Enter the batch quantity.")
      .refine((value) => /^\d+$/.test(value) && Number(value) > 0, {
        message: "Enter a whole number greater than zero.",
      }),
    expiresOn: z.string().min(1, "Enter the expiration date."),
  })
  .refine(({ expiresOn }) => Number.isFinite(Date.parse(expiresOn)), {
    message: "Expiration date must be a valid date.",
    path: ["expiresOn"],
  });

export type MedicineBatchFormValues = z.infer<typeof medicineBatchFormSchema>;
