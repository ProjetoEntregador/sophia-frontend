import { MedicationService } from "@/services/medicationService";
import { MedicineDetailsClient } from "./medicine-details-client";
import { getUserToken } from "@/app/actions/auth";

type MedicinePageProps = {
  params: Promise<{ medicineId: string }>;
};

export default async function MedicinePage({ params }: MedicinePageProps) {
  const { medicineId } = await params;

  const token = await getUserToken();

  const [medicine, batches] = await Promise.all([
    MedicationService.getMedicationById(medicineId, token),
    MedicationService.listMedicationBatchesByMedicationId(
      medicineId,
      token,
      0,
      1,
    ),
  ]);

  return (
    <MedicineDetailsClient
      medicine={medicine}
      initialBatches={batches.data}
      total={batches.total}
    />
  );
}
