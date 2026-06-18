import { z } from "zod";

export const medicineFormSchema = z.object({
  name: z.string().trim().min(1, "Enter the medicine name."),
  description: z
    .string()
    .trim()
    .min(1, "Enter the medicine description.")
    .max(300, "Description must have at most 300 characters."),
  price: z
    .string()
    .trim()
    .min(1, "Enter the medicine price.")
    .refine((value) => /^\d+([.,]\d{1,2})?$/.test(value), {
      message: "Enter a valid monetary value, for example 19.90.",
    }),
});

export type MedicineFormValues = z.infer<typeof medicineFormSchema>;
