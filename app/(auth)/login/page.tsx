"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "./login.schema";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/api";

export default function LoginForm() {
  const auth = useAuth();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (body) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await auth.login(body);
      router.push("/");
    } catch (error) {
      setSubmitError(
        getErrorMessage(
          error,
          "We could not log you in. Check your credentials and try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f0efe8_0%,#f8f5ef_35%,#ffffff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="w-[460px] rounded-[1rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_30px_100px_rgba(15,23,42,0.12)] sm:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">Log in</h2>
            <p className="mt-2 text-sm text-slate-600">
              Enter your credentials to access your account.
            </p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="usuario@email.com"
                register={register}
                error={errors}
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="********"
                register={register}
                error={errors}
              />
            </div>

            {submitError ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {submitError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Or
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            className="cursor-pointer inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-emerald-700 underline-offset-4 hover:underline"
            >
              Register
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
