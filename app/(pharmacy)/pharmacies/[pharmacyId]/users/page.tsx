"use client";
import { Table } from "@/components/Table";
import { useTable } from "@/hooks/useTable";

type PharmacyMember = {
  id: string;
  email: string;
  role: "admin" | "staff";
  status: "Active" | "Invited" | "Pending removal";
  lastAccess: string;
};

const members: PharmacyMember[] = [
  {
    id: "ana-costa",
    email: "ana@centralpharmacy.com",
    role: "admin",
    status: "Active",
    lastAccess: "Signed in 2 hours ago",
  },
  {
    id: "bruno-silva",
    email: "bruno@centralpharmacy.com",
    role: "staff",
    status: "Active",
    lastAccess: "Signed in yesterday",
  },
  {
    id: "carla-souza",
    email: "carla@centralpharmacy.com",
    role: "staff",
    status: "Invited",
    lastAccess: "Invite sent this morning",
  },
  {
    id: "diego-lima",
    email: "diego@centralpharmacy.com",
    role: "staff",
    status: "Pending removal",
    lastAccess: "Removal scheduled",
  },
];

const roleLabels: Record<PharmacyMember["role"], string> = {
  admin: "Admin",
  staff: "Staff",
};

const statusStyles: Record<PharmacyMember["status"], string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Invited: "bg-amber-50 text-amber-800",
  "Pending removal": "bg-rose-50 text-rose-700",
};

export default function PharmacyUsersPage() {
  const { currentItens, Pagination } = useTable({
    medicines: members,
    pageSize: 4,
  });

  return (
    <div className="space-y-6">
      <section className="border-b-[2px] border-slate-300 py-4">
        <h2 className="text-3xl font-semibold tracking-tight">
          Pharmacy Users
        </h2>
      </section>

      <section className="grid gap-6">
        <Table.Wrapper>
          <Table.Header>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Pharmacy members
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                Member list
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="ml-auto inline-flex items-center justify-center rounded-[1rem] border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Invite user
              </button>
            </div>
          </Table.Header>
          <Table.Body>
            {currentItens.map((member) => (
              <Item key={member.id} {...member} />
            ))}
          </Table.Body>
          <Pagination />
        </Table.Wrapper>
      </section>
    </div>
  );
}

function Item({ id, email, role, status, lastAccess }: PharmacyMember) {
  return (
    <article
      key={id}
      className="rounded-2xl border border-slate-100 px-5 py-5 transition hover:border-slate-200 hover:bg-slate-50/60"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="text-lg font-semibold text-slate-900">{email}</h4>
            <span
              className={[
                "rounded-full px-3 py-1 text-xs font-semibold",
                statusStyles[status],
              ].join(" ")}
            >
              {status}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{lastAccess}</p>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <div>
              <dt className="inline font-medium text-slate-600">Role:</dt>{" "}
              <dd className="inline">{roleLabels[role]}</dd>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
