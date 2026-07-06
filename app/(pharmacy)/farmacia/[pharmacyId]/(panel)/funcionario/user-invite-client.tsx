"use client";

import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { Table } from "@/components/Table";
import { useTable } from "@/hooks/useTable";
import { UserInviteForm } from "./user-invite-form";
import { useModal } from "@/hooks/useModal";
import { PharmacyMember } from "./page";
import { InviteService } from "@/services/inviteService";
import { getUserToken } from "@/app/actions/auth";

const statusStyles: Record<PharmacyMember["status"], string> = {
  Active: "bg-purple-50 text-purple-700",
  Invited: "bg-amber-50 text-amber-800",
  "Pending removal": "bg-rose-50 text-rose-700",
};

type UserInviteClientProps = {
  members: any[];
  pharmacyId: number;
  total: number;
};

export function UserInviteClient({
  members,
  pharmacyId,
  total,
}: UserInviteClientProps) {
  const { openModal, closeModal, Modal } = useModal();
  const { currentItens, addItem, removeItem, Pagination } = useTable({
    initialItens: members,
    pageSize: 6,
    totalItens: total,
    fetch: async (page) => {
      const token = await getUserToken();

      const res = await InviteService.listInvites(
        pharmacyId,
        token,
        6,
        (page - 1) * 6,
      );

      return res.data?.content;
    },
  });

  return (
    <>
      <div className="space-y-6">
        <section className="border-b-[2px] border-slate-300 py-4">
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Funcionários
          </h2>
        </section>

        <section className="grid gap-6">
          <Table.Wrapper>
            <Table.Header>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Funcionários
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  Lista de Funcionários
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openModal}
                  className="ml-auto inline-flex items-center justify-center rounded-[1rem] border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Convidar Funcionário
                </button>
              </div>
            </Table.Header>

            <Table.Body>
              {currentItens.map((member) => (
                <Item
                  key={member.id}
                  pharmacyId={pharmacyId}
                  onRemove={removeItem}
                  {...member}
                />
              ))}
            </Table.Body>
            <Pagination />
          </Table.Wrapper>
        </section>
      </div>

      <Modal closeModal={closeModal}>
        <UserInviteForm onCancel={closeModal} onSave={addItem} />
      </Modal>
    </>
  );
}

type ItemProps = PharmacyMember & {
  pharmacyId: string;
  onRemove: (id: string) => void;
};

function Item({
  pharmacyId,
  id,
  email,
  role,
  status,
  lastAccess,
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
            <p className="mt-2 text-sm text-slate-600">{lastAccess}</p>
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
