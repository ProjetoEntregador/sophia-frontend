import { MedicationService } from "@/services/medicationService";
import { PharmacyMedicinesClient } from "./pharmacy-medicines-client";

type PharmacyMedicinesPageProps = {
  params: Promise<{ pharmacyId: string }>;
};

export default async function PharmacyMedicinesPage({
  params,
}: PharmacyMedicinesPageProps) {
  const { pharmacyId } = await params;
  const id = Number.parseInt(pharmacyId, 10);

  const medicines = await MedicationService.listMedicationsByPharmacyId(id);

  return (
    <PharmacyMedicinesClient
      pharmacyId={pharmacyId}
      initialMedicines={medicines}
    />
  );
}
