"use client";
import { Table } from "@/components/Table";
import { useMemo, useState } from "react";

type useTableProps<T> = {
  medicines: T[];
  pageSize: number;
};

export function useTable<T>({ medicines, pageSize }: useTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(medicines.length / pageSize));
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const visibleMedicines = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return medicines.slice(startIndex, startIndex + pageSize);
  }, [currentPage]);

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
