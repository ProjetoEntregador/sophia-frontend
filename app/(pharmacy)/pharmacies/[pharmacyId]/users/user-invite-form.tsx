"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  userInviteFormSchema,
  type UserInviteFormValues,
} from "./user-invite-form.schema";

type UserInviteFormProps = {
  onCancel: () => void;
};

export function UserInviteForm({ onCancel }: UserInviteFormProps) {
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
      role: "staff",
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      handleClose();
    } catch {
      setSubmitError("We could not send the invite. Try again.");
    }
  });

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Pharmacy members
          </p>
          <h3
            id="user-invite-modal-title"
            className="mt-2 text-2xl font-semibold tracking-tight text-slate-900"
          >
            Invite user
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Send a pharmacy-specific invite to a new member and define the
            access level they will receive after accepting it.
          </p>
        </div>
      </div>

      <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
        <div>
          <Label htmlFor="email">User email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="teammate@pharmacy.com"
            register={register}
            error={errors}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          The invite will only be accepted by an account using the exact invited
          email address.
        </div>

        {submitError ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending invite..." : "Send invite"}
          </button>
        </div>
      </form>
    </>
  );
}
