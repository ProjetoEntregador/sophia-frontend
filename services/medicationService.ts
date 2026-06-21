import { medicineApi } from "@/lib/api";
import {
  CreateMedicationBatchPayload,
  CreateMedicationPayload,
  Medication,
  MedicationBatch,
  UpdateMedicationBatchPayload,
  UpdateMedicationPayload,
} from "@/types/medicine";

export class MedicationService {
  static async createMedication(body: CreateMedicationPayload) {
    const response = await medicineApi.post<Medication>("/medications", body);
    return response.data;
  }

  static async listMedications() {
    const response = await medicineApi.get<Medication[]>("/medications");
    return response.data;
  }

  static async getMedicationById(id: string) {
    const response = await medicineApi.get<Medication>(`/medications/${id}`);
    return response.data;
  }

  static async listMedicationsByPharmacyId(pharmacyId: number) {
    const response = await medicineApi.get<Medication[]>(
      `/medications/pharmacy/${pharmacyId}`,
    );
    return response.data;
  }

  static async updateMedication(id: string, body: UpdateMedicationPayload) {
    const response = await medicineApi.patch<Medication>(
      `/medications/${id}`,
      body,
    );
    return response.data;
  }

  static async deleteMedication(id: string) {
    const response = await medicineApi.delete(`/medications/${id}`);
    return response.data as undefined;
  }

  static async createMedicationBatch(body: CreateMedicationBatchPayload) {
    const response = await medicineApi.post<MedicationBatch>(
      "/medication-batches",
      body,
    );
    return response.data;
  }

  static async listMedicationBatches() {
    const response = await medicineApi.get<MedicationBatch[]>(
      "/medication-batches",
    );
    return response.data;
  }

  static async getMedicationBatchById(id: string) {
    const response = await medicineApi.get<MedicationBatch>(
      `/medication-batches/${id}`,
    );
    return response.data;
  }

  static async listMedicationBatchesByMedicationId(medicationId: string) {
    const response = await medicineApi.get<MedicationBatch[]>(
      `/medication-batches/medication/${medicationId}`,
    );
    return response.data;
  }

  static async updateMedicationBatch(
    id: string,
    body: UpdateMedicationBatchPayload,
  ) {
    const response = await medicineApi.patch<MedicationBatch>(
      `/medication-batches/${id}`,
      body,
    );
    return response.data;
  }

  static async deleteMedicationBatch(id: string) {
    const response = await medicineApi.delete(`/medication-batches/${id}`);
    return response.data as undefined;
  }
}
