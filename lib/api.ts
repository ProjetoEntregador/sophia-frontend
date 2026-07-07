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

export function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message =
      typeof error.response?.data?.message === "string"
        ? error.response.data.message
        : undefined;

    if (message) {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
