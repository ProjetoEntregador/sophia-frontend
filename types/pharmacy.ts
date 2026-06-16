export type PharmacyMembership = {
  id: string;
  name: string;
  role: "admin" | "staff";
  description: string;
};
