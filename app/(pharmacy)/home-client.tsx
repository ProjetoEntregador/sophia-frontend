"use client";
import { Card } from "@/components/Card";
import { useTable } from "@/hooks/useTable";
import { PharmacyListItem } from "@/types/pharmacy";
import Link from "next/link";
import { getUserToken } from "../actions/auth";
import { PharmacyService } from "@/services/pharmacyService";
import { NotFound } from "@/components/NotFound";

type HomeClientProps = {
  pharmacies: PharmacyListItem[];
  total: number;
};

export function HomeClient({ pharmacies, total }: HomeClientProps) {
  const { currentItens, Pagination } = useTable({
    initialItens: pharmacies,
    totalItens: total,
    pageSize: 9,
    fetch: async (page: number) => {
      const token = await getUserToken();
      const response = await PharmacyService.listPharmacies(
        (page - 1) * 9,
        9,
        token,
      );
      return response.data?.content as PharmacyListItem[];
    },
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f3f0e7_0%,#faf8f3_36%,#ffffff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full flex gap-3 sm:flex-row">
          <Link
            href="/farmacia/criar"
            className="ml-auto inline-flex items-center justify-center rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
          >
            Criar Farmácia
          </Link>
        </div>

        {currentItens.length === 0 ? (
          <section className="w-full py-8">
            <NotFound text="Nenhuma farmácia encontrada." />
          </section>
        ) : (
          <>
            <section className="w-full py-8">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {currentItens.map((pharmacy) => (
                  <Card
                    key={pharmacy.id}
                    id={pharmacy.id}
                    name={pharmacy.name}
                    phone={pharmacy.phone}
                    description="Acesse o painel para gerenciar os dados da farmácia, medicamentos e funcionários."
                  />
                ))}
              </div>
            </section>
            <Pagination />
          </>
        )}
      </div>
    </main>
  );
}
