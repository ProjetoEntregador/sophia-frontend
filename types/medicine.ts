export type Medicine = {
  id: string;
  name: string;
  status: string;
  notes: string;
  category: string;
  presentation: string;
};

export type MedicineBatchStatus = "Ready" | "Low stock" | "Reserved";

export type MedicineBatch = {
  id: string;
  code: string;
  quantity: string;
  receivedAt: string;
  expiresAt: string;
  status: MedicineBatchStatus;
  note: string;
};
