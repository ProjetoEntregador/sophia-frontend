import { getUserToken } from "@/app/actions/auth";
import { PharmacyService } from "@/services/pharmacyService";
import { HomeClient } from "./home-client";

export default async function Home() {
  const token = await getUserToken();
  const response = await PharmacyService.listPharmacies(9, 1, token);
  const pharmacies = response.data?.content ?? [];
  const total = response.data?.totalElements ?? 0;

  return <HomeClient pharmacies={pharmacies} totalItens={total} />;
}
