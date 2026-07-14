import { ReactNode } from "react";

type WrapperProps = {
  children: ReactNode;
};

function Wrapper({ children }: WrapperProps) {
  return (
    <article className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      {children}
    </article>
  );
}

type HeaderProps = {
  children: ReactNode;
};

function Header({ children }: HeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {children}
    </div>
  );
}

type BodyProps = {
  children: ReactNode;
};

function Body({ children }: BodyProps) {
  return <div className="mt-6 grid gap-4">{children}</div>;
}

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
};

function Pagination({
  currentPage,
  totalPages,
  canGoPrevious,
  canGoNext,
  goToPreviousPage,
  goToNextPage,
}: PaginationProps) {
  return (
    <div className="mt-6 flex flex-row justify-between items-center">
      <p className="text-sm font-semibold text-slate-600">
        {currentPage}{" "}
        <span className="font-medium text-slate-400">
          / {totalPages} páginas
        </span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goToPreviousPage}
          disabled={!canGoPrevious}
          aria-label="Previous page"
          className="inline-flex h-10 w-10 items-center justify-center rounded-[0.5rem] border border-slate-200 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <span aria-hidden="true">←</span>
        </button>

        <button
          type="button"
          onClick={goToNextPage}
          disabled={!canGoNext}
          aria-label="Next page"
          className="inline-flex h-10 w-10 items-center justify-center rounded-[0.5rem] border border-slate-200 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

export const Table = {
  Wrapper,
  Header,
  Body,
  Pagination,
};
