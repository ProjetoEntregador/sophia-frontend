"use client";

import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { Table } from "@/components/Table";
import { useModal } from "@/hooks/useModal";
import { useTable } from "@/hooks/useTable";
import { Medication, MedicationBatch } from "@/types/medicine";
import { useState } from "react";
import { MedicineBatchForm } from "./medicine-batch-form";
import { MedicationService } from "@/services/medicationService";

type MedicineDetailsClientProps = {
  medicine: Medication;
  initialBatches: MedicationBatch[];
};

export function MedicineDetailsClient({
  medicine,
  initialBatches,
}: MedicineDetailsClientProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { currentItens, addItem, removeItem, Pagination } = useTable({
    initialItens: initialBatches,
    pageSize: 4,
  });
  const { openModal, closeModal, Modal } = useModal();

  async function removeBatch(id: string) {
    removeItem(id);
    await MedicationService.deleteMedicationBatch(id);
  }

  return (
    <>
      <div className="space-y-6">
        <section className="border-b-[2px] border-slate-300 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Medicine overview
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            {medicine.name}
          </h2>
        </section>

        {submitError ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </p>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
          <article className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Catalog details
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  Medicine information
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {medicine.prescriptionRequired
                  ? "Prescription required"
                  : "Standard catalog item"}
              </span>
            </div>

            <p className="mt-6 text-sm leading-6 text-slate-600">
              {medicine.description ||
                "No description provided for this medicine."}
            </p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoItem label="Dosage" value={medicine.dosage} />
              <InfoItem label="Form" value={medicine.pharmaceuticalForm} />
              <InfoItem label="Price" value={`R$ ${medicine.unitPrice}`} />
              <InfoItem label="Manufacturer" value={medicine.manufacturer} />
              <InfoItem
                label="Stripe"
                value={medicine.stripe || "Not informed"}
              />
              <InfoItem
                label="Created at"
                value={new Date(medicine.createdAt).toLocaleDateString("en-CA")}
              />
            </dl>
          </article>

          <div className="grid gap-4">
            <MetricCard
              label="Active batches"
              value={String(currentItens.length).padStart(2, "0")}
              detail="Tracked for this medicine record"
            />
            <MetricCard
              label="Available quantity"
              value={String(sumBatchQuantities(currentItens))}
              detail="Across related batches"
            />
            <MetricCard
              label="Next expiry"
              value={getNextExpiryLabel(currentItens)}
              detail="Closest batch review date"
            />
          </div>
        </section>

        <section className="grid gap-6">
          <Table.Wrapper>
            <Table.Header>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Related stock
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  Batch list
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openModal}
                  className="ml-auto inline-flex items-center justify-center rounded-[1rem] border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Add batch
                </button>
              </div>
            </Table.Header>
            <Table.Body>
              {currentItens.map((batch) => (
                <BatchItem
                  key={batch.id}
                  batch={batch}
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
          medicationId={medicine.id}
          onCancel={closeModal}
          onSaved={(batch) => {
            addItem(batch);
            closeModal();
          }}
          onError={(message) => setSubmitError(message)}
        />
      </Modal>
    </>
  );
}

function sumBatchQuantities(batches: MedicationBatch[]) {
  return batches.reduce((sum, batch) => sum + batch.quantity, 0);
}

function getNextExpiryLabel(batches: MedicationBatch[]) {
  const sortedDates = batches
    .map((batch) => batch.expirationDate)
    .filter((value) => Number.isFinite(Date.parse(value)))
    .sort((left, right) => Date.parse(left) - Date.parse(right));

  if (!sortedDates.length) {
    return "Not informed";
  }

  return new Date(sortedDates[0]).toLocaleDateString("en-CA");
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 px-4 py-4">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-2 text-base font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </article>
  );
}

function BatchItem({
  batch,
  onDelete,
}: {
  batch: MedicationBatch;
  onDelete: () => Promise<void>;
}) {
  const { openModal, closeModal, Modal } = useModal();

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
                <dt className="inline font-medium text-slate-600">Quantity:</dt>{" "}
                <dd className="inline">{batch.quantity}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-slate-600">Expiry:</dt>{" "}
                <dd className="inline">
                  {new Date(batch.expirationDate).toLocaleDateString("en-CA")}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={openModal}
              className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              Delete
            </button>
          </div>
        </div>
      </article>
      <Modal closeModal={closeModal}>
        <ConfirmDeleteModal
          contextLabel="Pharmacy medicine batch"
          title="Remove batch"
          description={`Remove ${batch.batchCode} from this pharmacy workspace.`}
          impactMessage="This action permanently deletes the medicine batch record from the current pharmacy workspace."
          confirmLabel="Remove batch"
          onCancel={closeModal}
          onConfirm={async () => {
            await onDelete();
            closeModal();
          }}
        />
      </Modal>
    </>
  );
}
