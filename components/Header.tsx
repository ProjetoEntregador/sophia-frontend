export function Header() {
  return (
    <header className="border border-slate-200/80 bg-white/85 py-5 shadow-xs backdrop-blur">
      <div className="mx-auto max-w-7xl px-8 flex justify-between items-center lg:flex-row lg:justify-between">
        <h1 className="text-md font-semibold uppercase tracking-[0.24em] text-emerald-700">
          Sophia Pharmacy Workspace
        </h1>
        <p className="text-md text-slate-900 font-medium tracking-tight">
          Lucas Nunes
        </p>
      </div>
    </header>
  );
}
