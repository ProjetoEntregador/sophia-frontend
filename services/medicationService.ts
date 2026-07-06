import { getAuthorizedConfig, medicineApi } from "@/lib/api";
import {
  CreateMedicationBatchPayload,
  CreateMedicationPayload,
  Medication,
  MedicationBatch,
  UpdateMedicationBatchPayload,
  UpdateMedicationPayload,
} from "@/types/medicine";

export class MedicationService {
  static async createMedication(body: CreateMedicationPayload, token: string) {
    const response = await medicineApi.post<Medication>(
      "/medications",
      body,
      getAuthorizedConfig(token),
    );
    return response.data;
  }

  static async listMedications() {
    const response = await medicineApi.get<Medication[]>("/medications");
    return response.data;
  }

  static async getMedicationById(id: string, token: string) {
    const response = await medicineApi.get<Medication>(
      `/medications/${id}`,
      getAuthorizedConfig(token),
    );
    return response.data;
  }

  static async listMedicationsByPharmacyId(
    pharmacyId: number,
    offset: number,
    size: number,
    token: string,
  ) {
    const response = await medicineApi.get<Medication[]>(
      `/medications/pharmacy/${pharmacyId}?offset=${offset}&size=${size}`,
      getAuthorizedConfig(token),
    );

    return {
      data: response.data.items as Medication[],
      total: response.data.total as number,
      offset: offset,
      size: size,
    };
  }

  static async updateMedication(
    id: string,
    body: UpdateMedicationPayload,
    token: string,
  ) {
    const response = await medicineApi.patch<Medication>(
      `/medications/${id}`,
      body,
      getAuthorizedConfig(token),
    );
    return response.data;
  }

  static async deleteMedication(id: string, token: string) {
    const response = await medicineApi.delete(
      `/medications/${id}`,
      getAuthorizedConfig(token),
    );
    return response.data as undefined;
  }

  static async createMedicationBatch(
    body: CreateMedicationBatchPayload,
    token: string,
  ) {
    const response = await medicineApi.post<MedicationBatch>(
      "/medication-batches",
      body,
      getAuthorizedConfig(token),
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

  static async listMedicationBatchesByMedicationId(
    medicationId: string,
    token: string,
    offset: number,
    size: number,
  ) {
    const response = await medicineApi.get(
      `/medication-batches/medication/${medicationId}?offset=${offset}&size=${size}`,
      getAuthorizedConfig(token),
    );
    return {
      data: response.data.data as MedicationBatch[],
      total: response.data.total as number,
      offset: response.data.offset as number,
      size: response.data.size as number,
    };
  }

  static async updateMedicationBatch(
    id: string,
    body: UpdateMedicationBatchPayload,
    token: string,
  ) {
    const response = await medicineApi.patch<MedicationBatch>(
      `/medication-batches/${id}`,
      body,
      getAuthorizedConfig(token),
    );
    return response.data;
  }

  static async deleteMedicationBatch(id: string, token: string) {
    const response = await medicineApi.delete(
      `/medication-batches/${id}`,
      getAuthorizedConfig(token),
    );
    return response.data as undefined;
  }
}
