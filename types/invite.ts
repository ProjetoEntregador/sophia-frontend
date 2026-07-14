export type SendInvitePayload = {
  email: string;
};

export type AcceptInvitePayload = {
  token: string;
};

export type Invite = {
  id: number;
  email: string;
  status: string;
  expiration: string;
  invitedBy: string;
};
