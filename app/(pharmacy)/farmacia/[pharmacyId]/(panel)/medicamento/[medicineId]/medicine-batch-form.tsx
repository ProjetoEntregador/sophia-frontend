"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { MedicationBatch } from "@/types/medicine";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  medicineBatchFormSchema,
  type MedicineBatchFormValues,
} from "./medicine-batch-form.schema";
import { getErrorMessage } from "@/lib/api";

type MedicineBatchFormProps = {
  title: string;
  description: string;
  medicationId: string;
  initialBatch?: MedicationBatch;
  onCancel: () => void;
  onSaved: (batch: Omit<MedicationBatch, "id" | "createdAt">) => Promise<void>;
  onError: (message: string) => void;
};

export function MedicineBatchForm({
  title,
  description,
  medicationId,
  initialBatch,
  onCancel,
  onSaved,
  onError,
}: MedicineBatchFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
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

  useEffect(() => {
    if (initialBatch) {
      setValue("code", initialBatch.batchCode);
      setValue("quantity", String(initialBatch.quantity));
      setValue("expiresOn", initialBatch.expirationDate);
    }
  }, [initialBatch]);

  const handleClose = () => {
    reset();
    setSubmitError(null);
    onCancel();
  };

  const onSubmit = handleSubmit(async (body) => {
    setSubmitError(null);

    try {
      await onSaved({
        medicationId,
        batchCode: body.code.trim(),
        quantity: Number(body.quantity),
        expirationDate: body.expiresOn,
      });
      handleClose();
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Erro ao salvar o lote. Tente novamente mais tarde.",
      );
      setSubmitError(message);
      onError(message);
    }
  });

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Lote
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>

      <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
        <div className="w-full">
          <div>
            <Label htmlFor="code">Código do Lote</Label>
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
            <Label htmlFor="quantity">Quantidade</Label>
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
            <Label htmlFor="expiresOn">Data de Validade</Label>
            <Input
              id="expiresOn"
              type="date"
              name="expiresOn"
              placeholder="01/01/2026"
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
            {isSubmitting ? "Salvando Lote..." : "Salvar Lote"}
          </button>
        </div>
      </form>
    </>
  );
}
