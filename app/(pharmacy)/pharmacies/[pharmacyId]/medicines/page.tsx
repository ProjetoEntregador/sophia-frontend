"use client";
import { Table } from "@/components/Table";
import { useTable } from "@/hooks/useTable";
import { Medicine } from "@/types/medicine";

const medicines: Medicine[] = [
  {
    id: "paracetamol-500",
    name: "Paracetamol 500mg",
    category: "Analgesic",
    presentation: "Tablets",
    status: "Available",
    notes: "Standard over-the-counter pain and fever relief.",
  },
  {
    id: "amoxicillin-500",
    name: "Amoxicillin 500mg",
    category: "Antibiotic",
    presentation: "Capsules",
    status: "Controlled",
    notes: "Prescription-only medicine stored in restricted shelf.",
  },
  {
    id: "salbutamol-inhaler",
    name: "Salbutamol 100mcg",
    category: "Respiratory",
    presentation: "Inhaler",
    status: "Low stock",
    notes: "Reorder required before the weekend cycle count.",
  },
  {
    id: "omeprazole-20",
    name: "Omeprazole 20mg",
    category: "Gastrointestinal",
    presentation: "Capsules",
    status: "Available",
    notes: "Used frequently in daily dispensing flows.",
  },
];

export default function PharmacyMedicinesPage() {
  const { currentItens, Pagination } = useTable({ medicines, pageSize: 4 });

  return (
    <div className="space-y-6">
      <section className="border-b-[2px] border-slate-300 py-4">
        <h2 className="text-3xl font-semibold tracking-tight">
          Pharmacy Medicines
        </h2>
      </section>

      <section className="grid gap-6">
        <Table.Wrapper>
          <Table.Header>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Catalog entries
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                Medicine list
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="ml-auto inline-flex items-center justify-center rounded-[1rem] px-5 py-3 text-sm font-semibold text-slate-700 transition border-[1px] border-slate-200 hover:bg-slate-100"
              >
                Add medicine
              </button>
            </div>
          </Table.Header>
          <Table.Body>
            {currentItens.map((medicine) => (
              <Item key={medicine.id} {...medicine} />
            ))}
          </Table.Body>
          <Pagination />
        </Table.Wrapper>
      </section>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-700",
  Controlled: "bg-amber-50 text-amber-800",
  "Low stock": "bg-rose-50 text-rose-700",
};

function Item({ id, name, status, notes, category, presentation }: Medicine) {
  return (
    <article
      key={id}
      className="rounded-2xl border border-slate-100 px-5 py-5 transition hover:border-slate-200 hover:bg-slate-50/60"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="text-lg font-semibold text-slate-900">{name}</h4>
            <span
              className={[
                "rounded-full px-3 py-1 text-xs font-semibold",
                statusStyles[status] ?? "bg-slate-100 text-slate-700",
              ].join(" ")}
            >
              {status}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{notes}</p>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <div>
              <dt className="inline font-medium text-slate-600">Category:</dt>{" "}
              <dd className="inline">{category}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-slate-600">
                Presentation:
              </dt>{" "}
              <dd className="inline">{presentation}</dd>
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
