import { z } from "zod";

export const medicineFormSchema = z.object({
  name: z.string().trim().min(1, "Enter the medicine name."),
  dosage: z.string().trim().min(1, "Enter the medicine dosage."),
  pharmaceuticalForm: z
    .string()
    .trim()
    .min(1, "Enter the pharmaceutical form."),
  manufacturer: z.string().trim().min(1, "Enter the manufacturer."),
  description: z
    .string()
    .trim()
    .max(300, "Description must have at most 300 characters.")
    .optional()
    .or(z.literal("")),
  stripe: z
    .string()
    .trim()
    .max(50, "Stripe must have at most 50 characters."),
  unitPrice: z
    .string()
    .trim()
    .min(1, "Enter the medicine price.")
    .refine((value) => /^\d+([.,]\d{1,2})?$/.test(value), {
      message: "Enter a valid monetary value, for example 19.90.",
    }),
  prescriptionRequired: z.boolean(),
});

export type MedicineFormValues = z.infer<typeof medicineFormSchema>;
