"use client";

import { Table } from "@/components/Table";
import { useModal } from "@/hooks/useModal";
import { useTable } from "@/hooks/useTable";
import { Medication, MedicationBatch } from "@/types/medicine";
import { useState } from "react";
import { MedicineBatchForm } from "./medicine-batch-form";
import { MedicationService } from "@/services/medicationService";
import { getUserToken } from "@/app/actions/auth";
import { NotFound } from "@/components/NotFound";
import Link from "next/link";
import { BatchItem } from "@/components/BatchItem";

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
              {currentItens.length === 0 ? (
                <NotFound text="Nenhum lote encontrado." />
              ) : (
                currentItens.map((batch) => (
                  <BatchItem
                    key={batch.id}
                    medicineId={medicine.id}
                    initialBatch={batch}
                    onEdit={editItem}
                    onDelete={() => removeBatch(batch.id)}
                  />
                ))
              )}
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

type InfoItemProps = {
  label: string;
  value: string;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-2xl border border-slate-100 px-4 py-4">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-2 text-base font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
