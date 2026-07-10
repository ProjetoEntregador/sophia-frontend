export type Permission = {
  id: number;
  pharmacy: string;
  role: string;
};

export type UserPharmacyPermission = {
  id: number;
  userId: number;
  pharmacyId: number;
  role: string;
};
