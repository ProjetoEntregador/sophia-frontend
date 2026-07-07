import { getAuthorizedConfig, pharmacyApi } from "@/lib/api";
import { ApiList, ApiResponse } from "@/types/api";
import { AcceptInvitePayload, SendInvitePayload } from "@/types/invite";

export class InviteService {
  static async sendPharmacyInvite(
    pharmacyId: number,
    body: SendInvitePayload,
    token: string,
  ) {
    const response = await pharmacyApi.post<ApiResponse<null>>(
      `/invites/pharmacy/${pharmacyId}/send`,
      body,
      getAuthorizedConfig(token),
    );
    return response.data;
  }

  static async acceptInvite(body: AcceptInvitePayload, token: string) {
    const response = await pharmacyApi.post<ApiResponse<null>>(
      "/invites/accept",
      body,
      getAuthorizedConfig(token),
    );
    return response.data;
  }

  static async removeInvite(pharmacyId: number, id: number, token: string) {
    const response = await pharmacyApi.delete(
      `/invites/pharmacy/${pharmacyId}/cancel/${id}`,
      getAuthorizedConfig(token),
    );
    return response.data;
  }

  static async listInvites(
    id: number,
    token: string,
    size: number,
    offset: number,
  ) {
    const response = await pharmacyApi.get<ApiResponse<ApiList<any>>>(
      `/invites/pharmacy/${id}/list?offset=${offset}&size=${size}`,
      getAuthorizedConfig(token),
    );

    return response.data;
  }
}
