"use client";

import { getUserToken } from "@/app/actions/auth";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { useModal } from "@/hooks/useModal";
import { AuthService } from "@/services/authService";
import { PharmacyService } from "@/services/pharmacyService";
import { UserPharmacyPermission } from "@/types/permission";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PharmacyClientProps = {
  pharmacyId: number;
};

export function PharmacyClient({ pharmacyId }: PharmacyClientProps) {
  const [permission, setPermission] = useState({} as UserPharmacyPermission);
  const router = useRouter();
  const { openModal, closeModal, Modal } = useModal();

  async function onDelete() {
    const token = await getUserToken();
    await PharmacyService.deletePharmacy(pharmacyId, token);
    router.push("/");
  }

  useEffect(() => {
    const getData = async () => {
      const token = await getUserToken();
      const permission = await AuthService.checkPharmacyPermission(
        pharmacyId.toString(),
        token,
      );
      setPermission(permission.data);
    };

    getData();
  }, []);

  if (permission.role != "OWNER") {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={openModal}
        className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
      >
        Remover
      </button>
      <Modal closeModal={closeModal}>
        <ConfirmDeleteModal
          contextLabel="Farmácia"
          title="Remover Farmácia"
          description="Remove a farmácia."
          impactMessage="Essa ação removerá permanentemente a farmácia e tudo armazenado nela."
          confirmLabel="Remover Farmácia"
          onCancel={closeModal}
          onConfirm={() => {
            onDelete();
            closeModal();
          }}
        />
      </Modal>
      <Link
        href={`/farmacia/${pharmacyId}/editar`}
        className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
      >
        Editar
      </Link>
    </div>
  );
}
