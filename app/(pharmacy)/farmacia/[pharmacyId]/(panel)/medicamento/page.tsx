import { MedicationService } from "@/services/medicationService";
import { PharmacyMedicinesClient } from "./pharmacy-medicines-client";
import { getUserToken } from "@/app/actions/auth";

type PharmacyMedicinesPageProps = {
  params: Promise<{ pharmacyId: string }>;
};

export default async function PharmacyMedicinesPage({
  params,
}: PharmacyMedicinesPageProps) {
  const { pharmacyId } = await params;
  const id = Number.parseInt(pharmacyId, 10);

  const token = await getUserToken();
  const medicines = await MedicationService.listMedicationsByPharmacyId(
    id,
    0,
    6,
    token,
  );

  return (
    <PharmacyMedicinesClient
      pharmacyId={pharmacyId}
      initialMedicines={medicines.data ?? []}
      total={medicines.total ?? 0}
    />
  );
}
