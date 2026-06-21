import { AuthorizedRequestConfig } from "@/types/api";
import axios from "axios";

export const pharmacyApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PHARMACY_API_BASE_URL ?? "",
});

export const medicineApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MEDICINE_API_BASE_URL ?? "",
});

export function getAuthorizedConfig(token: string): AuthorizedRequestConfig {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
