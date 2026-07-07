export type Medication = {
  id: string;
  pharmacyId: number;
  name: string;
  dosage: string;
  pharmaceuticalForm: string;
  manufacturer: string;
  description: string | null;
  stripe: string | null;
  prescriptionRequired: boolean;
  unitPrice: string;
  createdAt: string;
};

export type CreateMedicationPayload = {
  pharmacyId: number;
  name: string;
  dosage: string;
  pharmaceuticalForm: string;
  manufacturer: string;
  description?: string;
  stripe?: string;
  prescriptionRequired: boolean;
  unitPrice: number;
};

export type UpdateMedicationPayload = Partial<CreateMedicationPayload>;

export type MedicationBatch = {
  id: string;
  medicationId: string;
  batchCode: string;
  quantity: number;
  expirationDate: string;
  createdAt: string;
};

export type CreateMedicationBatchPayload = {
  medicationId: string;
  batchNumber: string;
  quantity: number;
  expirationDate: string;
};

export type UpdateMedicationBatchPayload = Partial<CreateMedicationBatchPayload>;
