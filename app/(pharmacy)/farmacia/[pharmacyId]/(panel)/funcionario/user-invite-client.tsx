"use client";

import { Table } from "@/components/Table";
import { useTable } from "@/hooks/useTable";
import { UserInviteForm } from "./user-invite-form";
import { useModal } from "@/hooks/useModal";
import { InviteService } from "@/services/inviteService";
import { getUserToken } from "@/app/actions/auth";
import { NotFound } from "@/components/NotFound";
import { Invite } from "@/types/invite";
import { UserItem } from "@/components/UserItem";

type UserInviteClientProps = {
  members: Invite[];
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

      return res.data.content;
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
              {currentItens.length === 0 ? (
                <NotFound text="Nenhum funcionário encontrado." />
              ) : (
                currentItens.map((member) => (
                  <UserItem
                    key={member.id}
                    id={member.id.toString()}
                    pharmacyId={pharmacyId.toString()}
                    onRemove={removeItem}
                    email={member.email}
                    status={member.status}
                  />
                ))
              )}
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
