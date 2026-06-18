"use client";

import { Table } from "@/components/Table";
import { useTable } from "@/hooks/useTable";
import { Medicine, MedicineBatch, MedicineBatchStatus } from "@/types/medicine";
import { useParams } from "next/navigation";

type MedicineOverview = Medicine & {
  description: string;
  price: string;
  manufacturer: string;
  dosage: string;
  storage: string;
  batches: MedicineBatch[];
};

const medicineStatusStyles: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-700",
  Controlled: "bg-amber-50 text-amber-800",
  "Low stock": "bg-rose-50 text-rose-700",
};

const batchStatusStyles: Record<MedicineBatchStatus, string> = {
  Ready: "bg-emerald-50 text-emerald-700",
  "Low stock": "bg-rose-50 text-rose-700",
  Reserved: "bg-amber-50 text-amber-800",
};

const medicineCatalog: Record<string, MedicineOverview> = {
  "paracetamol-500": {
    id: "paracetamol-500",
    name: "Paracetamol 500mg",
    category: "Analgesic",
    presentation: "Tablets",
    status: "Available",
    notes: "Standard over-the-counter pain and fever relief.",
    description:
      "Primary non-prescription option for fever and mild pain, dispensed daily across walk-in care.",
    price: "$8.90",
    manufacturer: "Vida Farma",
    dosage: "500mg per tablet",
    storage: "Keep in a dry cabinet below 25°C.",
    batches: [
      {
        id: "batch-pt-2301",
        code: "PT-2301",
        quantity: "160 units",
        receivedAt: "Received on May 28, 2026",
        expiresAt: "Expires on December 20, 2026",
        status: "Ready",
        note: "Main dispensing batch for front counter demand.",
      },
      {
        id: "batch-pt-2304",
        code: "PT-2304",
        quantity: "42 units",
        receivedAt: "Received on June 8, 2026",
        expiresAt: "Expires on January 15, 2027",
        status: "Reserved",
        note: "Separated for upcoming neighborhood vaccination campaign.",
      },
      {
        id: "batch-pt-2219",
        code: "PT-2219",
        quantity: "18 units",
        receivedAt: "Received on April 11, 2026",
        expiresAt: "Expires on September 2, 2026",
        status: "Low stock",
        note: "Older batch prioritized for current dispensing rotation.",
      },
    ],
  },
  "amoxicillin-500": {
    id: "amoxicillin-500",
    name: "Amoxicillin 500mg",
    category: "Antibiotic",
    presentation: "Capsules",
    status: "Controlled",
    notes: "Prescription-only medicine stored in restricted shelf.",
    description:
      "Broad-spectrum antibiotic dispensed only with valid prescription review and controlled shelving checks.",
    price: "$24.50",
    manufacturer: "BioSintese",
    dosage: "500mg per capsule",
    storage: "Store in restricted shelf with controlled-access logging.",
    batches: [
      {
        id: "batch-am-4102",
        code: "AM-4102",
        quantity: "74 units",
        receivedAt: "Received on June 1, 2026",
        expiresAt: "Expires on February 10, 2027",
        status: "Ready",
        note: "Current prescription fulfillment batch.",
      },
      {
        id: "batch-am-4091",
        code: "AM-4091",
        quantity: "12 units",
        receivedAt: "Received on April 26, 2026",
        expiresAt: "Expires on August 18, 2026",
        status: "Low stock",
        note: "Small remainder pending depletion before restock reorder.",
      },
    ],
  },
  "salbutamol-inhaler": {
    id: "salbutamol-inhaler",
    name: "Salbutamol 100mcg",
    category: "Respiratory",
    presentation: "Inhaler",
    status: "Low stock",
    notes: "Reorder required before the weekend cycle count.",
    description:
      "Fast-acting bronchodilator inhaler with high turnover in urgent respiratory support cases.",
    price: "$31.20",
    manufacturer: "Respira Labs",
    dosage: "100mcg per actuation",
    storage: "Store upright away from excessive heat exposure.",
    batches: [
      {
        id: "batch-sb-1180",
        code: "SB-1180",
        quantity: "15 units",
        receivedAt: "Received on May 21, 2026",
        expiresAt: "Expires on November 30, 2026",
        status: "Low stock",
        note: "Last available batch before scheduled reorder intake.",
      },
      {
        id: "batch-sb-1187",
        code: "SB-1187",
        quantity: "24 units",
        receivedAt: "Received on June 10, 2026",
        expiresAt: "Expires on March 11, 2027",
        status: "Reserved",
        note: "Separated for recurring institutional respiratory care orders.",
      },
    ],
  },
};

export default function MedicinePage() {
  const params = useParams<{ medicineId: string }>();
  const { medicineId } = params;
  const medicine =
    medicineCatalog[medicineId] ?? createFallbackMedicineOverview(medicineId);
  const { currentItens, Pagination } = useTable({
    medicines: medicine.batches,
    pageSize: 3,
  });

  return (
    <div className="space-y-6">
      <section className="border-b-[2px] border-slate-300 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Medicine overview
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          {medicine.name}
        </h2>
      </section>

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
            <span
              className={[
                "rounded-full px-3 py-1 text-xs font-semibold",
                medicineStatusStyles[medicine.status] ??
                  "bg-slate-100 text-slate-700",
              ].join(" ")}
            >
              {medicine.status}
            </span>
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-600">
            {medicine.description}
          </p>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoItem label="Category" value={medicine.category} />
            <InfoItem label="Presentation" value={medicine.presentation} />
            <InfoItem label="Price" value={medicine.price} />
            <InfoItem label="Dosage" value={medicine.dosage} />
            <InfoItem label="Manufacturer" value={medicine.manufacturer} />
            <InfoItem label="Storage" value={medicine.storage} />
          </dl>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
            <p className="text-sm font-medium text-slate-700">
              Operational note
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {medicine.notes}
            </p>
          </div>
        </article>

        <div className="grid gap-4">
          <MetricCard
            label="Active batches"
            value={String(medicine.batches.length).padStart(2, "0")}
            detail="Tracked for this medicine record"
          />
          <MetricCard
            label="Available quantity"
            value={sumBatchQuantities(medicine.batches)}
            detail="Across related batches"
          />
          <MetricCard
            label="Next expiry"
            value={getNextExpiryLabel(medicine.batches)}
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
                className="ml-auto inline-flex items-center justify-center rounded-[1rem] border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Add batch
              </button>
            </div>
          </Table.Header>
          <Table.Body>
            {currentItens.map((batch) => (
              <BatchItem key={batch.id} {...batch} />
            ))}
          </Table.Body>
          <Pagination />
        </Table.Wrapper>
      </section>
    </div>
  );
}

function createFallbackMedicineOverview(medicineId: string): MedicineOverview {
  return {
    id: medicineId,
    name: "Medicine overview",
    category: "General",
    presentation: "Unit",
    status: "Available",
    notes: "Medicine record prepared for review.",
    description:
      "General medicine record used when a specific catalog entry is not available in the current mock workspace.",
    price: "$0.00",
    manufacturer: "Not informed",
    dosage: "Not informed",
    storage: "Follow standard pharmacy storage guidance.",
    batches: [
      {
        id: `${medicineId}-batch-1`,
        code: "GEN-0001",
        quantity: "0 units",
        receivedAt: "No receipt information",
        expiresAt: "No expiration information",
        status: "Reserved",
        note: "No related batch details available for this medicine yet.",
      },
    ],
  };
}

function sumBatchQuantities(batches: MedicineBatch[]) {
  const total = batches.reduce((sum, batch) => {
    const quantity = Number.parseInt(batch.quantity, 10);
    return sum + (Number.isNaN(quantity) ? 0 : quantity);
  }, 0);

  return `${total} units`;
}

function getNextExpiryLabel(batches: MedicineBatch[]) {
  const closestBatch = batches.find((batch) =>
    batch.expiresAt.startsWith("Expires"),
  );

  return closestBatch
    ? closestBatch.expiresAt.replace("Expires on ", "")
    : "Not informed";
}

type InfoItemProps = { label: string; value: string };

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-2xl border border-slate-100 px-4 py-4">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-2 text-base font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
};

function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <article className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </article>
  );
}

function BatchItem({
  code,
  quantity,
  receivedAt,
  expiresAt,
  status,
  note,
}: MedicineBatch) {
  return (
    <article className="rounded-2xl border border-slate-100 px-5 py-5 transition hover:border-slate-200 hover:bg-slate-50/60">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="text-lg font-semibold text-slate-900">{code}</h4>
            <span
              className={[
                "rounded-full px-3 py-1 text-xs font-semibold",
                batchStatusStyles[status],
              ].join(" ")}
            >
              {status}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{note}</p>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <div>
              <dt className="inline font-medium text-slate-600">Quantity:</dt>{" "}
              <dd className="inline">{quantity}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-slate-600">Received:</dt>{" "}
              <dd className="inline">{receivedAt}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-slate-600">Expiry:</dt>{" "}
              <dd className="inline">{expiresAt}</dd>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
