import { getAuthorizedConfig, pharmacyApi } from "@/lib/api";
import { ApiResponse } from "@/types/api";
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
}
