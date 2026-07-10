import { PharmacyMember } from "@/app/(pharmacy)/farmacia/[pharmacyId]/(panel)/funcionario/page";
import { getUserToken } from "@/app/actions/auth";
import { useModal } from "@/hooks/useModal";
import { InviteService } from "@/services/inviteService";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

const statusStyles: Record<PharmacyMember["status"], string> = {
  Active: "bg-purple-50 text-purple-700",
  Invited: "bg-amber-50 text-amber-800",
  "Pending removal": "bg-rose-50 text-rose-700",
};

type ItemProps = {
  id: string;
  email: string;
  status: string;
  pharmacyId: string;
  onRemove: (id: string) => void;
};

export function UserItem({
  pharmacyId,
  id,
  email,
  status,
  onRemove,
}: ItemProps) {
  const { closeModal, openModal, Modal } = useModal();

  const handleConfirmDelete = async () => {
    const token = await getUserToken();

    await InviteService.removeInvite(Number(pharmacyId), Number(id), token);
    onRemove(id);
    closeModal();
  };

  function getStatus(status: string) {
    if (status == "ACCEPTED") {
      return "Aceito";
    }
    if (status == "PENDING") {
      return "Convite Enviado";
    }
  }

  return (
    <>
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
                {getStatus(status)}
              </span>
            </div>
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <div>
                <dt className="inline font-medium text-slate-600">Papel:</dt>{" "}
                <dd className="inline">Funcionário</dd>
              </div>
            </dl>
          </div>

          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={openModal}
              className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              Remover
            </button>
          </div>
        </div>
      </article>
      <Modal closeModal={closeModal}>
        <ConfirmDeleteModal
          contextLabel="Funcionários"
          title="Remover Funcionário"
          description={`Remove ${email} da lista de funcionários.`}
          impactMessage="Essa ação removerá permanentemente o membro da lista de funcionários da farmácia."
          confirmLabel="Remover Funcionário"
          onCancel={closeModal}
          onConfirm={handleConfirmDelete}
        />
      </Modal>
    </>
  );
}
