const overviewMetrics = [
  { label: "Medicines", value: "128", detail: "34 low-stock items" },
  { label: "Members", value: "12", detail: "1 admin, 11 staff" },
  { label: "Pending invites", value: "3", detail: "Awaiting acceptance" },
];

const activityItems = [
  {
    title: "Paracetamol 500mg",
    detail: "Medicine updated by Ana Costa",
    status: "Recently edited",
  },
  {
    title: "Invite for carla@pharmacy.com",
    detail: "Admin invitation sent yesterday",
    status: "Pending",
  },
  {
    title: "New staff account",
    detail: "Membership activated this morning",
    status: "Active",
  },
];

export default async function PharmacyOverviewPage() {
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

      <section className="gap-6">
        <article className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Recent activity
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Latest workspace events
          </h3>

          <div className="mt-6 space-y-4">
            {activityItems.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-slate-900">{item.title}</h4>
                    <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
