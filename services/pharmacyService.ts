import { getAuthorizedConfig, pharmacyApi } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  CreatePharmacyPayload,
  NearbyPharmaciesQuery,
  NearbyPharmacy,
  PharmacyDetail,
  PharmacyListItem,
  UpdatePharmacyPayload,
} from "@/types/pharmacy";

export class PharmacyService {
  static async listPharmacies(token: string) {
    const response = await pharmacyApi.get<ApiResponse<PharmacyListItem[]>>(
      "/pharmacy/list",
      getAuthorizedConfig(token),
    );
    return response.data;
  }

  static async getPharmacyById(id: number, token: string) {
    const response = await pharmacyApi.get<ApiResponse<PharmacyDetail>>(
      `/pharmacy/${id}`,
      getAuthorizedConfig(token),
    );
    return response.data;
  }

  static async createPharmacy(body: CreatePharmacyPayload, token: string) {
    const response = await pharmacyApi.post<ApiResponse<PharmacyDetail>>(
      "/pharmacy/create",
      body,
      getAuthorizedConfig(token),
    );
    return response.data;
  }

  static async updatePharmacy(
    id: number,
    body: UpdatePharmacyPayload,
    token: string,
  ) {
    const response = await pharmacyApi.put<ApiResponse<PharmacyDetail>>(
      `/pharmacy/${id}`,
      body,
      getAuthorizedConfig(token),
    );
    return response.data;
  }

  static async deletePharmacy(id: number, token: string) {
    const response = await pharmacyApi.delete<ApiResponse<null>>(
      `/pharmacy/${id}`,
      getAuthorizedConfig(token),
    );
    return response.data;
  }

  static async findNearbyPharmacies(query: NearbyPharmaciesQuery) {
    const response = await pharmacyApi.get<ApiResponse<NearbyPharmacy[]>>(
      "/pharmacy/nearby",
      { params: query },
    );
    return response.data;
  }
}
