import { getUserToken } from "@/app/actions/auth";
import { Sidebar } from "@/components/Sidebar";
import { PharmacyService } from "@/services/pharmacyService";
import { notFound } from "next/navigation";

type PharmacyWorkspaceLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ pharmacyId: string }>;
};

export default async function PharmacyWorkspaceLayout({
  children,
  params,
}: PharmacyWorkspaceLayoutProps) {
  const { pharmacyId } = await params;
  const id = Number.parseInt(pharmacyId, 10);

  if (!Number.isInteger(id)) {
    notFound();
  }

  const token = await getUserToken();
  const response = await PharmacyService.getPharmacyById(id, token);
  const pharmacy = response.data;

  if (!pharmacy) {
    notFound();
  }

  return (
    <main className="min-h-screen text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <div className="w-[280px]"></div>
        <Sidebar pharmacyId={String(pharmacy.id)} name={pharmacy.name} />

        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
