import { PharmacyMembership } from "@/types/pharmacy";
import Link from "next/link";

type CardProps = {
  id: string;
  name: string;
  role: PharmacyMembership["role"];
  description: string;
};

const roleLabels: Record<PharmacyMembership["role"], string> = {
  admin: "Admin",
  staff: "Staff",
};

export function Card({ id, name, role, description }: CardProps) {
  return (
    <article
      key={id}
      className="flex flex-col group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Pharmacy
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">{name}</h2>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {roleLabels[role]}
        </span>
      </div>

      <p className="my-4 text-sm leading-6 text-slate-600">{description}</p>

      <div className="mt-auto flex items-center justify-between gap-4">
        <div className="text-sm text-slate-500">
          Role:{" "}
          <span className="font-medium text-slate-700">{roleLabels[role]}</span>
        </div>

        <Link
          href={`/pharmacies/${id}`}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Enter pharmacy
        </Link>
      </div>
    </article>
  );
}
