"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  medicineBatchFormSchema,
  type MedicineBatchFormValues,
} from "./medicine-batch-form.schema";

type MedicineBatchFormProps = {
  onCancel: () => void;
};

export function MedicineBatchForm({ onCancel }: MedicineBatchFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicineBatchFormValues>({
    resolver: zodResolver(medicineBatchFormSchema),
    defaultValues: {
      code: "",
      quantity: "",
      expiresOn: "",
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
      setSubmitError("We could not save the batch. Try again.");
    }
  });

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Related stock
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Add batch
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Register a medicine batch with the core stock details already used
            in this medicine workspace.
          </p>
        </div>
      </div>

      <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
        <div className="w-full">
          <div>
            <Label htmlFor="code">Batch code</Label>
            <Input
              id="code"
              type="text"
              name="code"
              placeholder="PT-2408"
              register={register}
              error={errors}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="text"
              inputMode="numeric"
              name="quantity"
              placeholder="160"
              register={register}
              error={errors}
            />
          </div>

          <div>
            <Label htmlFor="expiresOn">Expiration date</Label>
            <Input
              id="expiresOn"
              type="date"
              name="expiresOn"
              register={register}
              error={errors}
            />
          </div>
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
            {isSubmitting ? "Saving batch..." : "Save batch"}
          </button>
        </div>
      </form>
    </>
  );
}
