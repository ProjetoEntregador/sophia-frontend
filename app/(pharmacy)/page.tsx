import { Card } from "@/components/Card";
import { PharmacyMembership } from "@/types/pharmacy";
import Link from "next/link";

const pharmacies: PharmacyMembership[] = [
  {
    id: "central-pharmacy",
    name: "Central Pharmacy",
    role: "admin",
    description: "Main workspace for inventory and member management.",
  },
  {
    id: "north-side-unit",
    name: "North Side Unit",
    role: "staff",
    description: "Medicine operations for the north district team.",
  },
];

export default function Home() {
  const hasPharmacies = pharmacies.length > 0;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f3f0e7_0%,#faf8f3_36%,#ffffff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full flex gap-3 sm:flex-row">
          <Link
            href="/pharmacies/new"
            className="ml-auto inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Create pharmacy
          </Link>
        </div>

        <section className="flex-1 py-8">
          {hasPharmacies ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {pharmacies.map((pharmacy) => (
                <Card key={pharmacy.id} {...pharmacy} />
              ))}
            </div>
          ) : (
            <section className="mx-auto flex max-w-2xl flex-col items-start rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-7 py-10 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                No pharmacies yet
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Create your first pharmacy
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                You do not belong to any pharmacy yet. Create one to start
                managing medicines, users, and pharmacy-specific access.
              </p>
              <div className="mt-7">
                <Link
                  href="/pharmacies/new"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  Create pharmacy
                </Link>
              </div>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
