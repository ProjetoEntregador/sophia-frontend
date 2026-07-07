import { Sidebar } from "@/components/Sidebar";

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
        <Sidebar
          pharmacyId={pharmacy.id}
          role={pharmacy.role}
          name={pharmacy.name}
        />

        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
