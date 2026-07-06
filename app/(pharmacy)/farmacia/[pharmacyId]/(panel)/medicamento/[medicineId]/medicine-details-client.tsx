"use client";

import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { Table } from "@/components/Table";
import { useModal } from "@/hooks/useModal";
import { useTable } from "@/hooks/useTable";
import { Medication, MedicationBatch } from "@/types/medicine";
import { useState } from "react";
import { MedicineBatchForm } from "./medicine-batch-form";
import { MedicationService } from "@/services/medicationService";
import Link from "next/link";
import { getUserToken } from "@/app/actions/auth";

type MedicineDetailsClientProps = {
  medicine: Medication;
  initialBatches: MedicationBatch[];
  total: number;
};

export function MedicineDetailsClient({
  medicine,
  initialBatches,
  total,
}: MedicineDetailsClientProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { currentItens, addItem, editItem, removeItem, Pagination } = useTable({
    initialItens: initialBatches,
    pageSize: 6,
    totalItens: total,
    fetch: async (page) => {
      const token = await getUserToken();

      const res = await MedicationService.listMedicationBatchesByMedicationId(
        medicine.id,
        token,
        (page - 1) * 6,
        6,
      );

      return res.data;
    },
  });
  const { openModal, closeModal, Modal } = useModal();

  async function removeBatch(id: string) {
    const token = await getUserToken();

    await MedicationService.deleteMedicationBatch(id, token);
    removeItem(id);
  }

  return (
    <>
      <div className="space-y-6">
        <section className="border-b-[2px] border-slate-300 py-4">
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            {medicine.name}
          </h2>
        </section>

        {submitError ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </p>
        ) : null}

        <section className="grid gap-4">
          <article className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Detalhe medicamento
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  Informações do Medicamento
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {medicine.prescriptionRequired
                  ? "Exige Prescrição"
                  : "Não Exige Prescrição"}
              </span>
            </div>

            <p className="mt-6 text-sm leading-6 text-slate-600">
              {medicine.description || "Sem descrição."}
            </p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoItem label="Dose" value={medicine.dosage} />
              <InfoItem
                label="Fórmula Farmacêutica"
                value={medicine.pharmaceuticalForm}
              />
              <InfoItem label="Preço" value={`R$ ${medicine.unitPrice}`} />
              <InfoItem label="Fabricante" value={medicine.manufacturer} />
              <InfoItem
                label="Tarja"
                value={medicine.stripe || "Not informed"}
              />
              <InfoItem
                label="Data de Criação"
                value={new Date(medicine.createdAt).toLocaleDateString("en-CA")}
              />
            </dl>
          </article>
        </section>

        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href={`/farmacia/${medicine.pharmacyId}/medicamento/${medicine.id}/editar`}
            className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
          >
            Editar
          </Link>
        </div>

        <section className="grid gap-6">
          <Table.Wrapper>
            <Table.Header>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Lotes do Medicamento
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  Lista de Lotes
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openModal}
                  className="ml-auto inline-flex items-center justify-center rounded-[1rem] border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Criar Lote
                </button>
              </div>
            </Table.Header>
            <Table.Body>
              {currentItens.map((batch) => (
                <BatchItem
                  key={batch.id}
                  medicineId={medicine.id}
                  initialBatch={batch}
                  onEdit={editItem}
                  onDelete={() => removeBatch(batch.id)}
                />
              ))}
            </Table.Body>
            <Pagination />
          </Table.Wrapper>
        </section>
      </div>

      <Modal closeModal={closeModal}>
        <MedicineBatchForm
          title="Criar Lote"
          description="Preencha os campos abaixo para criar uma nova lote."
          medicationId={medicine.id}
          onCancel={closeModal}
          onSaved={async (batchData) => {
            const token = await getUserToken();

            const batch = await MedicationService.createMedicationBatch(
              {
                batchNumber: batchData.batchCode,
                expirationDate: batchData.expirationDate,
                medicationId: batchData.medicationId,
                quantity: batchData.quantity,
              },
              token,
            );
            addItem(batch);
            closeModal();
          }}
          onError={(message) => setSubmitError(message)}
        />
      </Modal>
    </>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 px-4 py-4">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-2 text-base font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function BatchItem({
  initialBatch,
  onEdit,
  onDelete,
  medicineId,
}: {
  initialBatch: MedicationBatch;
  onEdit: (data: MedicationBatch, id: string) => void;
  onDelete: () => Promise<void>;
  medicineId: string;
}) {
  const confirmDelete = useModal();
  const edit = useModal();
  const [batch, setBatch] = useState(initialBatch);

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

            console.log(newBatch);

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
