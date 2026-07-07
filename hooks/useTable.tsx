"use client";
import { Table } from "@/components/Table";
import { useMemo, useState } from "react";

type useTableProps<T> = {
  initialItens: T[];
  pageSize: number;
};

export function useTable<T>({ initialItens, pageSize }: useTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(initialItens.length / pageSize));
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const visibleMedicines = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return initialItens.slice(startIndex, startIndex + pageSize);
  }, [currentPage, initialItens, pageSize]);

  const goToPreviousPage = () => {
    if (canGoPrevious) {
      setCurrentPage((page) => page - 1);
    }
  };

  const goToNextPage = () => {
    if (canGoNext) {
      setCurrentPage((page) => page + 1);
    }
  };

  return {
    currentPage,
    goToPreviousPage,
    goToNextPage,
    currentItens: visibleMedicines,
    Pagination: () => (
      <Table.Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
    ),
  };
}
