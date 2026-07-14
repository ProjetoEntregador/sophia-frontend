"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import {
  userInviteFormSchema,
  type UserInviteFormValues,
} from "./user-invite-form.schema";
import { getErrorMessage } from "@/lib/api";
import { InviteService } from "@/services/inviteService";
import { getUserToken } from "@/app/actions/auth";
import { Invite } from "@/types/invite";

type UserInviteFormProps = {
  onCancel: () => void;
  onSave: (data: Invite) => void;
};

export function UserInviteForm({ onCancel, onSave }: UserInviteFormProps) {
  const params = useParams<{ pharmacyId: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserInviteFormValues>({
    resolver: zodResolver(userInviteFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleClose = () => {
    reset();
    setSubmitError(null);
    onCancel();
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const token = await getUserToken();

      const invite = await InviteService.sendPharmacyInvite(
        Number(params.pharmacyId),
        { email: values.email.trim() },
        token,
      );
      onSave(invite.data);
      handleClose();
    } catch (error) {
      setSubmitError(
        getErrorMessage(
          error,
          "Problemas ao enviar o convite. Tente novamente mais tarde.",
        ),
      );
    }
  });

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Funcionários
          </p>
          <h3
            id="user-invite-modal-title"
            className="mt-2 text-2xl font-semibold tracking-tight text-slate-900"
          >
            Convidar Funcionário
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Preencha o campo abaixo para convidar alguém a se tornar funcionário
            desta farmácia
          </p>
        </div>
      </div>

      <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="johndoe@email.com"
            register={register}
            error={errors}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          Este convite só poderá ser aceito por uma conta que use este mesmo
          e-mail
        </div>

        {submitError ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Convidando..." : "Convidar"}
          </button>
        </div>
      </form>
    </>
  );
}
