import { getUserToken } from "@/app/actions/auth";
import { MedicationService } from "@/services/medicationService";
import { PharmacyService } from "@/services/pharmacyService";
import Link from "next/link";
import { notFound } from "next/navigation";

type PharmacyOverviewPageProps = {
  params: Promise<{ pharmacyId: string }>;
};

export default async function PharmacyOverviewPage({
  params,
}: PharmacyOverviewPageProps) {
  const { pharmacyId } = await params;
  const id = Number.parseInt(pharmacyId, 10);

  const token = await getUserToken();

  const [pharmacyResponse, medicines] = await Promise.all([
    PharmacyService.getPharmacyById(id, token),
    MedicationService.listMedicationsByPharmacyId(id),
  ]);
  const pharmacy = pharmacyResponse.data;

  if (!pharmacy) {
    notFound();
  }

  const overviewMetrics = [
    {
      label: "Medicines",
      value: String(medicines.length).padStart(2, "0"),
      detail: "Catalog entries loaded from the medication service",
    },
    {
      label: "City",
      value: pharmacy.city,
      detail: "Location returned by the pharmacy service",
    },
    {
      label: "Phone",
      value: pharmacy.phone,
      detail: "Current contact information for this workspace",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="border-b-[2px] border-slate-300 py-4">
        <h2 className="text-3xl font-semibold tracking-tight">
          Pharmacy Overview
        </h2>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {overviewMetrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]"
          >
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {metric.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {metric.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <article className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Pharmacy details
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Workspace information
          </h3>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-100 px-4 py-4">
              <p className="text-sm font-medium text-slate-500">Address</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {pharmacy.address}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 px-4 py-4">
              <p className="text-sm font-medium text-slate-500">Coordinates</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {pharmacy.latitude}, {pharmacy.longitude}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Shortcuts
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Workspace actions
          </h3>

          <div className="mt-6 grid gap-3">
            <Link
              href={`/pharmacies/${pharmacy.id}/medicines`}
              className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Open medicine catalog
            </Link>
            <Link
              href={`/pharmacies/${pharmacy.id}/users`}
              className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Open invite and membership area
            </Link>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
              The current backend exposes invite creation, but it does not yet
              expose member listing or role data for this page.
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
