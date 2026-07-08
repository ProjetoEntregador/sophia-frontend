import { useModal } from "@/hooks/useModal";
import { MedicationBatch } from "@/types/medicine";
import { useState } from "react";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { MedicineBatchForm } from "@/app/(pharmacy)/farmacia/[pharmacyId]/(panel)/medicamento/[medicineId]/medicine-batch-form";
import { getUserToken } from "@/app/actions/auth";
import { MedicationService } from "@/services/medicationService";

type BatchItemProps = {
  initialBatch: MedicationBatch;
  onEdit: (data: MedicationBatch, id: string) => void;
  onDelete: () => Promise<void>;
  medicineId: string;
};

export function BatchItem({
  initialBatch,
  onEdit,
  onDelete,
  medicineId,
}: BatchItemProps) {
  const [batch, setBatch] = useState(initialBatch);
  const confirmDelete = useModal();
  const edit = useModal();

  return (
    <>
      <article className="rounded-2xl border border-slate-100 px-5 py-5 transition hover:border-slate-200 hover:bg-slate-50/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h4 className="text-lg font-semibold text-slate-900">
                {batch.batchCode}
              </h4>
            </div>
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <div>
                <dt className="inline font-medium text-slate-600">
                  Quantidade:
                </dt>{" "}
                <dd className="inline">{batch.quantity}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-slate-600">
                  Data de Validade:
                </dt>{" "}
                <dd className="inline">
                  {new Date(batch.expirationDate).toLocaleDateString("en-CA")}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={edit.openModal}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={confirmDelete.openModal}
              className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              Remover
            </button>
          </div>
        </div>
      </article>
      <confirmDelete.Modal closeModal={confirmDelete.closeModal}>
        <ConfirmDeleteModal
          contextLabel="Lote"
          title="Remover Lote"
          description={`Remove ${batch.batchCode} dos lotes do medicamento.`}
          impactMessage="Essa ação removerá permanentemente o lote do medicamento."
          confirmLabel="Remover Lote"
          onCancel={confirmDelete.closeModal}
          onConfirm={async () => {
            await onDelete();
            confirmDelete.closeModal();
          }}
        />
      </confirmDelete.Modal>
      <edit.Modal closeModal={edit.closeModal}>
        <MedicineBatchForm
          title="Editar Lote"
          description="Preencha os campos abaixo para editar o lote."
          medicationId={medicineId}
          initialBatch={{
            ...batch,
            expirationDate: new Date(batch.expirationDate)
              .toISOString()
              .split("T")[0],
          }}
          onCancel={edit.closeModal}
          onSaved={async (batchData) => {
            const token = await getUserToken();

            await MedicationService.updateMedicationBatch(
              initialBatch.id,
              {
                batchCode: batchData.batchCode,
                expirationDate: batchData.expirationDate,
                medicationId: batchData.medicationId,
                quantity: batchData.quantity,
              },
              token,
            );

            const newBatch = {
              ...batch,
              batchCode: batchData.batchCode,
              expirationDate: batchData.expirationDate,
              medicationId: batchData.medicationId,
              quantity: batchData.quantity,
            };

            setBatch(newBatch);
            onEdit(newBatch, batch.id);
            edit.closeModal();
          }}
          onError={() => {}}
        />
      </edit.Modal>
    </>
  );
}
