"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  pharmacyFormSchema,
  type PharmacyFormValues,
} from "./pharmacy-form.schema";
import { PharmacyService } from "@/services/pharmacyService";
import { getUserToken } from "@/app/actions/auth";
import { getErrorMessage } from "@/lib/api";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
});

export default function CreatePharmacyPage() {
  const router = useRouter();
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PharmacyFormValues>({
    resolver: zodResolver(pharmacyFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      city: "",
    },
  });

  useEffect(() => {
    if (navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      });
    }
  }, []);

  const onSubmit = handleSubmit(async (body) => {
    setSubmitError(null);

    try {
      const token = await getUserToken();

      await PharmacyService.createPharmacy(
        {
          ...body,
          latitude: lat,
          longitude: lng,
        },
        token,
      );

      router.push(`/pharmacies`);
    } catch (error) {
      setSubmitError(
        getErrorMessage(error, "We could not create the pharmacy."),
      );
    }
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f3f0e7_0%,#faf8f3_36%,#ffffff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Dashboard
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Create pharmacy
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Create a new pharmacy workspace using the current backend contract.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            <div>
              <Label htmlFor="name">Pharmacy name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Pharmacy name"
                register={register}
                error={errors}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="(00) 00000-0000"
                  register={register}
                  error={errors}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  name="city"
                  placeholder="Cidade"
                  register={register}
                  error={errors}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                name="address"
                placeholder="Número, Rua, Bairro"
                register={register}
                error={errors}
              />
            </div>

            <Label htmlFor="place">Location</Label>
            <LocationPicker
              lat={lat}
              lng={lng}
              onChange={(newLat, newLng) => {
                setLat(newLat);
                setLng(newLng);
              }}
            />

            {submitError ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {submitError}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating pharmacy..." : "Create pharmacy"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
