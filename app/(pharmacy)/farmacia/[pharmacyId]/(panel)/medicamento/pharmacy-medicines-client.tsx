"use client";

import { getUserToken } from "@/app/actions/auth";
import { MedicationItem } from "@/components/MedicationItem";
import { NotFound } from "@/components/NotFound";
import { Table } from "@/components/Table";
import { useTable } from "@/hooks/useTable";
import { MedicationService } from "@/services/medicationService";
import { Medication } from "@/types/medicine";
import Link from "next/link";

type PharmacyMedicinesClientProps = {
  pharmacyId: string;
  initialMedicines: Medication[];
  total: number;
};

export function PharmacyMedicinesClient({
  pharmacyId,
  initialMedicines,
  total,
}: PharmacyMedicinesClientProps) {
  const { currentItens, removeItem, Pagination } = useTable({
    initialItens: initialMedicines,
    pageSize: 6,
    totalItens: total,
    fetch: async (page) => {
      const token = await getUserToken();

      const res = await MedicationService.listMedicationsByPharmacyId(
        Number(pharmacyId),
        (page - 1) * 6,
        6,
        token,
      );

      return res.data;
    },
  });

  async function removeMedicine(id: string) {
    const token = await getUserToken();
    await MedicationService.deleteMedication(id, token);
    removeItem(id);
  }

  return (
    <div className="space-y-6">
      <section className="border-b-[2px] border-slate-300 py-4">
        <h2 className="text-3xl font-semibold tracking-tight">Medicamentos</h2>
      </section>

      <section className="grid gap-6">
        <Table.Wrapper>
          <Table.Header>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Estoque
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                Lista de Medicamentos
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/farmacia/${pharmacyId}/medicamento/criar`}
                className="ml-auto inline-flex items-center justify-center rounded-[1rem] border-[1px] border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Criar Medicamento
              </Link>
            </div>
          </Table.Header>
          <Table.Body>
            {currentItens.length === 0 ? (
              <NotFound text="Nenhum medicamento encontrado." />
            ) : (
              currentItens.map((medicine) => (
                <MedicationItem
                  key={medicine.id}
                  medicine={medicine}
                  pharmacyId={pharmacyId}
                  onDelete={() => removeMedicine(medicine.id)}
                />
              ))
            )}
          </Table.Body>
          <Pagination />
        </Table.Wrapper>
      </section>
    </div>
  );
}
