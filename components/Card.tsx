import Link from "next/link";

type CardProps = {
  id: number;
  name: string;
  phone: string;
  description: string;
};

export function Card({ id, name, phone, description }: CardProps) {
  return (
    <article
      key={id}
      className="flex flex-col group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Farmácia
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">{name}</h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          {phone}
        </span>
      </div>

      <p className="my-4 text-sm leading-6 text-slate-600">{description}</p>

      <div className="mt-auto flex items-center justify-between gap-4">
        <div className="text-sm text-slate-500">
          Contato: <span className="font-medium text-slate-700">{phone}</span>
        </div>

        <Link
          href={`/farmacia/${id}`}
          className="inline-flex items-center justify-center rounded-full bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
        >
          Acessar
        </Link>
      </div>
    </article>
  );
}
