import { getAuthorizedConfig, pharmacyApi } from "@/lib/api";
import { ApiList, ApiResponse } from "@/types/api";
import { AcceptInvitePayload, Invite, SendInvitePayload } from "@/types/invite";

export class InviteService {
  static async sendPharmacyInvite(
    pharmacyId: number,
    body: SendInvitePayload,
    token: string,
  ) {
    const { data } = await pharmacyApi.post<ApiResponse<Invite>>(
      `/invites/pharmacy/${pharmacyId}/send`,
      body,
      getAuthorizedConfig(token),
    );
    return data;
  }

  static async acceptInvite(body: AcceptInvitePayload, token: string) {
    const { data } = await pharmacyApi.post<ApiResponse<null>>(
      "/invites/accept",
      body,
      getAuthorizedConfig(token),
    );
    return data;
  }

  static async listInvites(
    id: number,
    token: string,
    size: number,
    offset: number,
  ) {
    const { data } = await pharmacyApi.get<ApiResponse<ApiList<Invite>>>(
      `/invites/pharmacy/${id}/list?offset=${offset}&size=${size}`,
      getAuthorizedConfig(token),
    );
    return data;
  }

  static async removeInvite(pharmacyId: number, id: number, token: string) {
    const { data } = await pharmacyApi.delete<ApiResponse<null>>(
      `/invites/pharmacy/${pharmacyId}/cancel/${id}`,
      getAuthorizedConfig(token),
    );
    return data;
  }
}
