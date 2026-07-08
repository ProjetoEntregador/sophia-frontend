"use client";

import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { MedicationService } from "@/services/medicationService";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { medicineFormSchema, MedicineFormValues } from "./medicine-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/lib/api";
import { Checkbox } from "@/components/Checkbox";
import { getUserToken } from "@/app/actions/auth";

export default function CreateMedicinePage() {
  const router = useRouter();
  const params = useParams<{ pharmacyId: string }>();
  const { pharmacyId } = params;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineFormSchema),
    defaultValues: {
      name: "",
      dosage: "",
      pharmaceuticalForm: "",
      manufacturer: "",
      description: "",
      stripe: "",
      unitPrice: "",
      prescriptionRequired: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    const token = await getUserToken();

    try {
      const id = Number.parseInt(pharmacyId, 10);

      await MedicationService.createMedication(
        {
          pharmacyId: id,
          name: values.name.trim(),
          dosage: values.dosage.trim(),
          pharmaceuticalForm: values.pharmaceuticalForm.trim(),
          manufacturer: values.manufacturer.trim(),
          description: values.description?.trim() || undefined,
          stripe: values.stripe.trim() || undefined,
          prescriptionRequired: values.prescriptionRequired,
          unitPrice: Number(values.unitPrice.replace(",", ".")),
        },
        token,
      );

      router.push(`/farmacia/${id}/medicamento`);
    } catch (error) {
      setSubmitError(
        getErrorMessage(
          error,
          "Problemas ao criar o medicamento. Tente novamente mais tarde.",
        ),
      );
    }
  });

  return (
    <div className="space-y-6">
      <section className="border-b-[2px] border-slate-300 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Medicamento
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Criar Medicamento
        </h2>
      </section>

      <section className="grid gap-6">
        <article className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex flex-col">
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              Criar Medicamento
            </h3>
          </div>

          <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
            <div>
              <Label htmlFor="name">Nome do Medicamento</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Paracetamol"
                register={register}
                error={errors}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <Label htmlFor="dosage">Dose</Label>
                <Input
                  id="dosage"
                  type="text"
                  name="dosage"
                  placeholder="500mg"
                  register={register}
                  error={errors}
                />
              </div>
              <div>
                <Label htmlFor="unitPrice">Preço</Label>
                <Input
                  id="unitPrice"
                  type="text"
                  inputMode="decimal"
                  name="unitPrice"
                  placeholder="19.90"
                  register={register}
                  error={errors}
                />
              </div>
              <div>
                <Label htmlFor="stripe">Tarja</Label>
                <Input
                  id="stripe"
                  type="text"
                  name="stripe"
                  placeholder="Preta"
                  register={register}
                  error={errors}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="pharmaceuticalForm">Fórmula Farmacêutica</Label>
                <Input
                  id="pharmaceuticalForm"
                  type="text"
                  name="pharmaceuticalForm"
                  placeholder="Comprimido"
                  register={register}
                  error={errors}
                />
              </div>
              <div>
                <Label htmlFor="manufacturer">Fabricante</Label>
                <Input
                  id="manufacturer"
                  type="text"
                  name="manufacturer"
                  placeholder="OMS"
                  register={register}
                  error={errors}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Informações adicionais sobre o medicamento"
                register={register}
                error={errors}
              />
            </div>

            <label
              htmlFor="prescription"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
            >
              <Checkbox
                id="prescription"
                name="prescriptionRequired"
                register={register}
                error={errors}
              />
              Precisa de Prescrição
            </label>

            {submitError ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {submitError}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Link
                href={`/farmacia/${pharmacyId}/medicamento`}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Criando Medicamento..." : "Criar Medicamento"}
              </button>
            </div>
          </form>
        </article>
      </section>
    </div>
  );
}
