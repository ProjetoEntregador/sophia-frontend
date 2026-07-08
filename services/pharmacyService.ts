import { getAuthorizedConfig, pharmacyApi } from "@/lib/api";
import { ApiList, ApiResponse } from "@/types/api";
import {
  CreatePharmacyPayload, PharmacyDetail,
  PharmacyListItem,
  UpdatePharmacyPayload
} from "@/types/pharmacy";

export class PharmacyService {
  static async listPharmacies(offset: number, size: number, token: string) {
    const { data } = await pharmacyApi.get<
      ApiResponse<ApiList<PharmacyListItem>>
    >(
      `/pharmacy/list?offset=${offset}&size=${size}`,
      getAuthorizedConfig(token),
    );
    return data;
  }

  static async getPharmacyById(id: number, token: string) {
    const { data } = await pharmacyApi.get<ApiResponse<PharmacyDetail>>(
      `/pharmacy/${id}`,
      getAuthorizedConfig(token),
    );
    return data;
  }

  static async createPharmacy(body: CreatePharmacyPayload, token: string) {
    const { data } = await pharmacyApi.post<ApiResponse<PharmacyDetail>>(
      "/pharmacy/create",
      body,
      getAuthorizedConfig(token),
    );
    return data;
  }

  static async updatePharmacy(
    id: number,
    body: UpdatePharmacyPayload,
    token: string,
  ) {
    const { data } = await pharmacyApi.put<
      ApiResponse<Omit<PharmacyDetail, "id">>
    >(`/pharmacy/${id}`, body, getAuthorizedConfig(token));
    return data;
  }

  static async deletePharmacy(id: number, token: string) {
    const { data } = await pharmacyApi.delete<ApiResponse<null>>(
      `/pharmacy/${id}`,
      getAuthorizedConfig(token),
    );
    return data;
  }
}
