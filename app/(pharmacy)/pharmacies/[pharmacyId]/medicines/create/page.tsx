"use client";

import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { medicineFormSchema, MedicineFormValues } from "./medicine-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";

type SavedMedicine = {
  name: string;
  description: string;
  price: string;
};

export default function CreateMedicinePage() {
  const params = useParams<{ pharmacyId: string }>();
  const { pharmacyId } = params;

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedMedicine, setSavedMedicine] = useState<SavedMedicine | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSavedMedicine({
        name: values.name.trim(),
        description: values.description.trim(),
        price: values.price.trim(),
      });

      reset();
    } catch {
      setSubmitError("We could not save the medicine. Try again.");
    }
  });

  return (
    <div className="space-y-6">
      <section className="border-b-[2px] border-slate-300 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Medicines
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Create Medicine
        </h2>
      </section>

      <section className="grid gap-6">
        <article className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Medicine catalog
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              Create medicine
            </h3>
          </div>

          <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
            <div>
              <Label htmlFor="name">Medicine name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Paracetamol 500mg"
                register={register}
                error={errors}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the medicine so staff can identify it quickly in the catalog."
                register={register}
                error={errors}
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="text"
                inputMode="decimal"
                name="price"
                placeholder="19.90"
                register={register}
                error={errors}
              />
            </div>

            {submitError ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {submitError}
              </p>
            ) : null}

            {savedMedicine ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <p className="font-semibold">Medicine saved successfully.</p>
                <p className="mt-1">
                  {savedMedicine.name} was added with price{" "}
                  {savedMedicine.price}.
                </p>
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href={`/pharmacies/${pharmacyId}/medicines`}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving medicine..." : "Save medicine"}
              </button>
            </div>
          </form>
        </article>
      </section>
    </div>
  );
}
