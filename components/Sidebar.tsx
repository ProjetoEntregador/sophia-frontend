"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  pharmacyId: string;
  name: string;
};

const navigationItems = [
  { label: "Overview", href: "" },
  { label: "Medicines", href: "/medicines" },
  { label: "Users", href: "/users" },
];

export function Sidebar({ pharmacyId, name }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] h-[calc(100vh-112px)] fixed rounded-[1rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <div className="border-b border-slate-100 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Pharmacy workspace
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{name}</h1>
      </div>

      <nav className="mt-5 space-y-1">
        {navigationItems.map((item) => {
          const href = `/pharmacies/${pharmacyId}${item.href}`;
          const isActive = pathname === href;

          return (
            <Link
              key={item.label}
              href={href}
              className={[
                "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-slate-900 text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
                  : "text-slate-700 hover:bg-slate-100",
              ].join(" ")}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
