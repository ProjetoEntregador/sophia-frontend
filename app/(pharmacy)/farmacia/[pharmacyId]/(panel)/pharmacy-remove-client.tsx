"use client";

import { getUserToken } from "@/app/actions/auth";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { useModal } from "@/hooks/useModal";
import { PharmacyService } from "@/services/pharmacyService";
import { useRouter } from "next/navigation";

type PharmacyRemoveClientProps = {
  pharmacyId: number;
};

export function PharmacyRemoveClient({
  pharmacyId,
}: PharmacyRemoveClientProps) {
  const router = useRouter();
  const { openModal, closeModal, Modal } = useModal();

  async function onDelete() {
    const token = await getUserToken();
    await PharmacyService.deletePharmacy(pharmacyId, token);
    router.push("/");
  }

  return (
    <>
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
    </>
  );
}
