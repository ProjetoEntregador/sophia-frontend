import { getAuthorizedConfig, medicineApi } from "@/lib/api";
import {
  DataPaginatedApiResponse,
  ItemsPaginatedApiResponse,
} from "@/types/api";
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
    const { data } = await medicineApi.post<Medication>(
      "/medications",
      body,
      getAuthorizedConfig(token),
    );
    return data;
  }

  static async getMedicationById(id: string, token: string) {
    try {
      const { data } = await medicineApi.get<Medication>(
        `/medications/${id}`,
        getAuthorizedConfig(token),
      );
      return data;
    } catch (err) {
      return {} as Medication;
    }
  }

  static async listMedicationsByPharmacyId(
    pharmacyId: number,
    offset: number,
    size: number,
    token: string,
  ) {
    try {
      const { data } = await medicineApi.get<
        ItemsPaginatedApiResponse<Medication>
      >(
        `/medications/pharmacy/${pharmacyId}?offset=${offset}&size=${size}`,
        getAuthorizedConfig(token),
      );

      return {
        data: data.items,
        total: data.total,
        offset: offset,
        size: size,
      };
    } catch (err) {
      return {
        data: [],
        total: 0,
        offset: offset,
        size: size,
      };
    }
  }

  static async updateMedication(
    id: string,
    body: UpdateMedicationPayload,
    token: string,
  ) {
    const { data } = await medicineApi.patch<Medication>(
      `/medications/${id}`,
      body,
      getAuthorizedConfig(token),
    );
    return data;
  }

  static async deleteMedication(id: string, token: string) {
    const { data } = await medicineApi.delete<null>(
      `/medications/${id}`,
      getAuthorizedConfig(token),
    );
    return data;
  }

  static async createMedicationBatch(
    body: CreateMedicationBatchPayload,
    token: string,
  ) {
    const { data } = await medicineApi.post<MedicationBatch>(
      "/medication-batches",
      body,
      getAuthorizedConfig(token),
    );
    return data;
  }

  static async getMedicationBatchById(id: string) {
    const { data } = await medicineApi.get<MedicationBatch>(
      `/medication-batches/${id}`,
    );
    return data;
  }

  static async listMedicationBatchesByMedicationId(
    medicationId: string,
    token: string,
    offset: number,
    size: number,
  ) {
    try {
      const { data } = await medicineApi.get<
        DataPaginatedApiResponse<MedicationBatch>
      >(
        `/medication-batches/medication/${medicationId}?offset=${offset}&size=${size}`,
        getAuthorizedConfig(token),
      );
      return {
        data: data.data,
        total: data.total,
        offset: offset,
        size: size,
      };
    } catch (err) {
      return {
        data: [],
        total: 0,
        offset: offset,
        size: size,
      };
    }
  }

  static async updateMedicationBatch(
    id: string,
    body: UpdateMedicationBatchPayload,
    token: string,
  ) {
    const { data } = await medicineApi.patch<MedicationBatch>(
      `/medication-batches/${id}`,
      body,
      getAuthorizedConfig(token),
    );
    return data;
  }

  static async deleteMedicationBatch(id: string, token: string) {
    const { data } = await medicineApi.delete<null>(
      `/medication-batches/${id}`,
      getAuthorizedConfig(token),
    );
    return data;
  }
}
