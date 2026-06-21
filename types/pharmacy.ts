import { Medication } from "./medicine";

export type PharmacyMembership = {
  id: string;
  name: string;
  role: "admin" | "staff";
  description: string;
};

export type PharmacyListItem = {
  id: number;
  name: string;
  phone: string;
};

export type PharmacyDetail = {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
};

export type CreatePharmacyPayload = {
  name: string;
  phone: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
};

export type UpdatePharmacyPayload = Partial<CreatePharmacyPayload>;

export type NearbyMedication = Omit<Medication, "pharmacyId">;

export type NearbyPharmacy = {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  distanceKm: number;
  medications: NearbyMedication[];
};

export type NearbyPharmaciesQuery = {
  latitude: number;
  longitude: number;
  radiusKm: number;
};
