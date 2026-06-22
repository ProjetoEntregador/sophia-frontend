import { z } from "zod";

export const pharmacyFormSchema = z.object({
  name: z.string().trim().min(1, "Preencha o nome da farmácia."),
  phone: z.string().trim().min(1, "Preencha o telefone da farmácia."),
  address: z.string().trim().min(1, "Preencha o endereço da farmácia."),
  city: z.string().trim().min(1, "Preencha a cidade onde a farmácia fica."),
});

export type PharmacyFormValues = z.infer<typeof pharmacyFormSchema>;
