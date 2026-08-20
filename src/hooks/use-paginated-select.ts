"use client";

import { useCallback, useEffect, useRef } from "react";
import type { TPaginationResponse, TStatus } from "@/types";

export type TPaginatedSelectFetchArgs = {
  page: number;
  search: string;
};

type Params<TItem> = {
  /** Si es false no dispara GETs (p. ej. el select aún no se muestra). */
  enabled: boolean;
  data: TPaginationResponse<TItem> | undefined;
  status: TStatus | string;
  /**
   * Al cambiar (paciente, filtro, etc.) vuelve a página 1 y limpia la búsqueda.
   * También se resetea al pasar `enabled` de false → true.
   */
  resetKey?: string | number | null;
  /** Despacha el GET de la página pedida (sin Size: la API usa su default). */
  fetchPage: (args: TPaginatedSelectFetchArgs) => void;
};

/**
 * Lógica de paginación + búsqueda para `CustomFormSelect`
 * (`onLoadMore` / `onSearch` / `hasMore` / `isLoadingMore`).
 *
 * El select acumula ítems; Redux solo guarda la última página.
 */
export const usePaginatedSelect = <TItem>({
  enabled,
  data,
  status,
  resetKey = null,
  fetchPage,
}: Params<TItem>) => {
  const pageRef = useRef(1);
  const searchRef = useRef("");
  const fetchPageRef = useRef(fetchPage);
  fetchPageRef.current = fetchPage;

  const hasMore = (data?.page ?? 1) < (data?.totalPages ?? 1);
  const isLoading = status === "loading";
  const isLoadingMore = isLoading && pageRef.current > 1;
  const isSearching = isLoading && pageRef.current === 1;

  const reloadFirstPage = useCallback(() => {
    pageRef.current = 1;
    searchRef.current = "";
    fetchPageRef.current({
      page: 1,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;
    reloadFirstPage();
  }, [enabled, resetKey, reloadFirstPage]);

  const onSearch = useCallback(
    (search: string) => {
      if (!enabled) return;
      const nextSearch = search.trim();
      searchRef.current = nextSearch;
      pageRef.current = 1;
      fetchPageRef.current({
        page: 1,
        search: nextSearch,
      });
    },
    [enabled],
  );

  const onLoadMore = useCallback(() => {
    if (!enabled || !hasMore || isLoading) return;
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    fetchPageRef.current({
      page: nextPage,
      search: searchRef.current,
    });
  }, [enabled, hasMore, isLoading]);

  return {
    items: data?.items ?? [],
    hasMore,
    isLoadingMore,
    isSearching,
    isInitialLoading: isSearching,
    onSearch,
    onLoadMore,
    /** Props listas para `CustomFormSelect` (paginación). */
    paginationProps: {
      onLoadMore,
      hasMore,
      isLoadingMore,
    },
  };
};
