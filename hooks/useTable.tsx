"use client";

import { Table } from "@/components/Table";
import { useMemo, useState } from "react";

type UseTableProps<T extends TableItem> = {
  initialItens: T[];
  pageSize: number;
  totalItens: number;
  fetch: (page: number) => Promise<T[]>;
};

type TableItem = {
  id: string | number;
};

export function useTable<T extends TableItem>({
  initialItens,
  pageSize,
  totalItens,
  fetch,
}: UseTableProps<T>) {
  const [items, setItems] = useState(initialItens);
  const [currentTotalItens, setCurrentTotalItens] = useState(totalItens);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(currentTotalItens / pageSize));

  const currentItens = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [currentPage, items, pageSize]);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const goToPreviousPage = () => {
    if (canGoPrevious) {
      setCurrentPage((page) => page - 1);
    }
  };

  const goToNextPage = async () => {
    if (canGoNext) {
      setCurrentPage((page) => page + 1);

      const shouldFetchMoreItems = items.length < currentTotalItens;
      if (shouldFetchMoreItems) {
        const nextItems = await fetch(currentPage + 1);
        setItems((pre) => [...pre, ...nextItems]);
      }
    }
  };

  const addItem = (data: T) => {
    setItems((pre) => [data, ...pre]);
    setCurrentTotalItens((pre) => pre + 1);
  };

  const editItem = (data: T, id: string | number) => {
    const newItems = items.filter((item) => {
      if (item.id != id) {
        return item;
      }
      return {
        ...item,
        ...data,
      };
    });
    setItems(newItems);
  };

  const removeItem = (id: string | number) => {
    const newItems = items.filter((item) => item.id != id);
    setItems(newItems);
    setCurrentTotalItens((pre) => pre - 1);

    const startIndex = (currentPage - 1) * pageSize;
    const shouldGoToPreviousPage = !newItems[startIndex];
    if (shouldGoToPreviousPage) {
      setCurrentPage((page) => Math.max(1, page - 1));
    }
  };

  return {
    currentPage,
    goToPreviousPage,
    goToNextPage,
    currentItens,
    addItem,
    editItem,
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
