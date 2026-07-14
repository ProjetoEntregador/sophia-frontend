import { useModal } from "@/hooks/useModal";
import { Medication } from "@/types/medicine";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import Link from "next/link";

type ItemProps = {
  medicine: Medication;
  pharmacyId: string;
  onDelete: () => void;
};

export function MedicationItem({ medicine, pharmacyId, onDelete }: ItemProps) {
  const { openModal, closeModal, Modal } = useModal();

  return (
    <>
      <article className="rounded-2xl border border-slate-100 px-5 py-5 transition hover:border-slate-200 hover:bg-slate-50/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h4 className="text-lg font-semibold text-slate-900">
                {medicine.name}
              </h4>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {medicine.prescriptionRequired
                  ? "Exige Prescrição"
                  : "Não Exige Prescrição"}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {medicine.description || "Sem descrição."}
            </p>
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <div>
                <dt className="inline font-medium text-slate-600">Dose:</dt>{" "}
                <dd className="inline">{medicine.dosage}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-slate-600">Preço:</dt>{" "}
                <dd className="inline">R$ {medicine.unitPrice}</dd>
              </div>
            </dl>
          </div>

          <div className="flex shrink-0 gap-3">
            <Link
              href={`/farmacia/${pharmacyId}/medicamento/${medicine.id}`}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Detalhar
            </Link>
            <button
              type="button"
              onClick={openModal}
              className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              Remover
            </button>
          </div>
        </div>
      </article>
      <Modal closeModal={closeModal}>
        <ConfirmDeleteModal
          contextLabel="Estoque"
          title="Remover Medicamento"
          description={`Remove ${medicine.name} do estoque.`}
          impactMessage="Essa ação removerá permanentemente o medicamento da farmácia."
          confirmLabel="Remover Medicamento"
          onCancel={closeModal}
          onConfirm={() => {
            onDelete();
            closeModal();
          }}
        />
      </Modal>
    </>
  );
}
