import { MedicationService } from "@/services/medicationService";
import { MedicineDetailsClient } from "./medicine-details-client";

type MedicinePageProps = {
  params: Promise<{ medicineId: string }>;
};

export default async function MedicinePage({ params }: MedicinePageProps) {
  const { medicineId } = await params;

  const [medicine, batches] = await Promise.all([
    MedicationService.getMedicationById(medicineId),
    MedicationService.listMedicationBatchesByMedicationId(medicineId),
  ]);

  return <MedicineDetailsClient medicine={medicine} initialBatches={batches} />;
}
