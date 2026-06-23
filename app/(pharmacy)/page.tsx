import { getUserToken } from "@/app/actions/auth";
import { Card } from "@/components/Card";
import { PharmacyService } from "@/services/pharmacyService";
import { PharmacyDetail } from "@/types/pharmacy";
import Link from "next/link";

export default async function Home() {
  const token = await getUserToken();
  const response = await PharmacyService.listPharmacies(token);
  const pharmacies = response.data as PharmacyDetail[];

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

        <section className="flex-1 py-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pharmacies.map((pharmacy) => (
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
      </div>
    </main>
  );
}
