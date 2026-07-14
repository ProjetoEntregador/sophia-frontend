import { getUserToken } from "@/app/actions/auth";
import { InviteService } from "@/services/inviteService";
import { PharmacyMembership } from "@/types/pharmacy";
import { UserInviteClient } from "./user-invite-client";

export type PharmacyMember = {
  id: string;
  email: string;
  role: PharmacyMembership["role"];
  status: string;
  lastAccess: string;
};

type PharmacyUsersPageProps = {
  params: Promise<{ pharmacyId: string }>;
};

export default async function PharmacyUsersPage({
  params,
}: PharmacyUsersPageProps) {
  const { pharmacyId } = await params;
  const id = Number.parseInt(pharmacyId, 10);

  const token = await getUserToken();
  const invites = await InviteService.listInvites(id, token, 6, 0);

  return (
    <UserInviteClient
      members={invites.data.content}
      total={invites.data.totalElements}
      pharmacyId={id}
    />
  );
}
