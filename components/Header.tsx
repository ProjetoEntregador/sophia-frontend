"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const auth = useAuth();

  return (
    <header className="border border-slate-200/80 bg-white py-5 shadow-xs backdrop-blur sticky top-0">
      <div className="mx-auto max-w-7xl px-8 flex justify-between items-center lg:flex-row lg:justify-between">
        <Link href="/">
          <h1 className="text-md font-semibold uppercase tracking-[0.24em] text-purple-700">
            Sophia
          </h1>
        </Link>
        <p
          className="text-md text-slate-900 font-medium tracking-tight"
          onClick={async () => {
            await auth.logout();
            router.push("/entrar");
          }}
        >
          {auth.user.name}
        </p>
      </div>
    </header>
  );
}
