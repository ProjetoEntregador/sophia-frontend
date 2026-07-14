import { getUserToken } from "@/app/actions/auth";
import { PharmacyService } from "@/services/pharmacyService";
import { notFound } from "next/navigation";
import { ShowLocation } from "./show-location";
import { PharmacyClient } from "./pharmacy-client";

type PharmacyOverviewPageProps = {
  params: Promise<{ pharmacyId: string }>;
};

export default async function PharmacyOverviewPage({
  params,
}: PharmacyOverviewPageProps) {
  const { pharmacyId } = await params;
  const id = Number.parseInt(pharmacyId, 10);

  const token = await getUserToken();
  const response = await PharmacyService.getPharmacyById(id, token);
  const pharmacy = response.data;

  if (!pharmacy) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="border-b-[2px] border-slate-300 py-4">
        <h2 className="text-3xl font-semibold tracking-tight">Dashboard</h2>
      </section>

      <section className="gap-6">
        <article className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Detalhes da farmácia
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Informações
          </h3>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-100 px-4 py-4">
              <p className="text-sm font-medium text-slate-500">Telefone</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {pharmacy.phone}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 px-4 py-4">
              <p className="text-sm font-medium text-slate-500">Cidade</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {pharmacy.city}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 px-4 py-4">
              <p className="text-sm font-medium text-slate-500">Endereço</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {pharmacy.address}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 px-4 py-4">
              <p className="mb-2 text-sm font-medium text-slate-500">
                Localização
              </p>
              <ShowLocation
                latitude={pharmacy.latitude}
                longitude={pharmacy.longitude}
              />
            </div>
          </div>

          <PharmacyClient pharmacyId={id} />
        </article>
      </section>
    </div>
  );
}
