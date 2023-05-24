import React from 'react';
import { create } from 'zustand';

type PaginationState = {
  totalItems: number;
  pageSize: number;
  currentPage: number;
};

type PaginationMeta = {
  totalPages: number;
  previousEnabled: boolean;
  nextEnabled: boolean;
};

type Pagination = PaginationState & PaginationMeta;
type PaginationArgs = Pick<PaginationState, 'totalItems' | 'pageSize'>;

const INITIAL_PAGE = 1;

export const usePaginationContext = create<{
  pagination: Pagination;
  setPagination: (pg: PaginationArgs) => void;
  setNextPage: () => void;
  setPrevPage: () => void;
  setFirstPage: () => void;
}>((set, get) => ({
  pagination: {
    totalPages: 0,
    pageSize: 0,
    currentPage: INITIAL_PAGE,
    nextEnabled: false,
    previousEnabled: false,
    totalItems: 0,
  },
  setPagination: (args: PaginationArgs) => {
    const totalPages = Math.ceil(args.totalItems / args.pageSize);
    set({
      pagination: {
        ...get().pagination,
        currentPage: INITIAL_PAGE,
        pageSize: args.pageSize,
        totalItems: args.totalItems,
        totalPages,
        nextEnabled: INITIAL_PAGE < totalPages,
        previousEnabled: false,
      },
    });
  },
  setNextPage: () => {
    const { currentPage, totalPages } = get().pagination;
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      set({
        pagination: {
          ...get().pagination,
          currentPage: nextPage,
          nextEnabled: nextPage < totalPages,
          previousEnabled: true,
        },
      });
    }
  },
  setPrevPage: () => {
    const { currentPage } = get().pagination;
    if (currentPage > INITIAL_PAGE) {
      const prevPage = currentPage - 1;
      set({
        pagination: {
          ...get().pagination,
          currentPage: prevPage,
          nextEnabled: true,
          previousEnabled: prevPage > 1,
          // previousEnabled: true,
        },
      });
    }
  },
  setFirstPage: () => {
    const { totalPages } = get().pagination;
    set({
      pagination: {
        ...get().pagination,
        currentPage: INITIAL_PAGE,
        nextEnabled: totalPages > INITIAL_PAGE,
        previousEnabled: false,
      },
    });
  },
}));

export interface ListContextProps {
  total: number;
  perPage: number;
}

type ListPaginationContextProps = ListContextProps;

const ListPaginationContextProvider: FCC<{ value: ListPaginationContextProps }> = ({ children, value }) => {
  const { setPagination } = usePaginationContext();

  React.useEffect(() => {
    setPagination({
      pageSize: value.perPage,
      totalItems: value.total,
    });
  }, [value]);

  return <>{children}</>;
};

export default ListPaginationContextProvider;
