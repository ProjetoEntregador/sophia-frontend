"use client";
import { Table } from "@/components/Table";
import { useMemo, useState } from "react";

type useTableProps<T extends { id: string }> = {
  initialItens: T[];
  pageSize: number;
};

export function useTable<T extends { id: string }>({
  initialItens,
  pageSize,
}: useTableProps<T>) {
  const [items, setItems] = useState(initialItens);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(initialItens.length / pageSize));
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const currentItens = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [currentPage, items, pageSize]);

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

  const addItem = (data: T) => {
    setItems((pre) => [data, ...pre]);
  };

  const removeItem = (id: string) => {
    const newItems = items.filter((item) => item.id != id);
    setItems(newItems);
  };

  return {
    currentPage,
    goToPreviousPage,
    goToNextPage,
    currentItens,
    addItem,
    removeItem,
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
