import Link from "next/link";

const navigationItems = [
  { label: "Overview", href: "" },
  { label: "Medicines", href: "/medicines" },
  { label: "Users", href: "/users" },
];

type PharmacyWorkspaceLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ pharmacyId: string }>;
};

export default async function PharmacyWorkspaceLayout({
  children,
  params,
}: PharmacyWorkspaceLayoutProps) {
  const { pharmacyId } = await params;

  const pharmacy = {
    id: pharmacyId,
    name: "Central Pharmacy",
    role: "admin" as const,
    location: "Downtown district",
  };

  return (
    <main className="min-h-screen text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <div className="w-[280px]"></div>
        <aside className="w-[280px] h-[calc(100vh-112px)] fixed rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <div className="border-b border-slate-100 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Pharmacy workspace
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {pharmacy.name}
            </h1>
          </div>

          <nav className="mt-5 space-y-1">
            {navigationItems
              .filter(
                (item) => item.label !== "Users" || pharmacy.role !== "staff",
              )
              .map((item) => {
                const href = `/pharmacies/${pharmacy.id}${item.href}`;
                const isActive = item.label === "Overview";

                return (
                  <Link
                    key={item.label}
                    href={href}
                    className={[
                      "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-slate-900 text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
                        : "text-slate-700 hover:bg-slate-100",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
          </nav>
        </aside>

        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
