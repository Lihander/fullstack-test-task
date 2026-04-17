import { useCallback, useEffect, useState } from "react";

import type { PaginatedResponse } from "@/shared/api";

type FetchPage<T> = (page: number, pageSize: number) => Promise<PaginatedResponse<T>>;

type UsePaginatedResourceOptions<T> = {
  fetchPage: FetchPage<T>;
  fallbackErrorMessage: string;
  initialPageSize?: number;
};

const DEFAULT_PAGE_SIZE = 5;

function getErrorMessage(loadError: unknown, fallbackErrorMessage: string) {
  return loadError instanceof Error ? loadError.message : fallbackErrorMessage;
}

export function usePaginatedResource<T>({
  fetchPage,
  fallbackErrorMessage,
  initialPageSize = DEFAULT_PAGE_SIZE,
}: UsePaginatedResourceOptions<T>) {
  const [page, setPageState] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [data, setData] = useState<PaginatedResponse<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(
    async (nextPage: number) => {
      try {
        const response = await fetchPage(nextPage, pageSize);
        setData(response);
        setError(null);
      } catch (loadError) {
        setError(getErrorMessage(loadError, fallbackErrorMessage));
      } finally {
        setIsLoading(false);
      }
    },
    [fallbackErrorMessage, fetchPage, pageSize],
  );

  useEffect(() => {
    let isActive = true;

    const fetchCurrentPage = async () => {
      try {
        const response = await fetchPage(page, pageSize);
        if (!isActive) {
          return;
        }

        setData(response);
        setError(null);
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(getErrorMessage(loadError, fallbackErrorMessage));
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void fetchCurrentPage();

    return () => {
      isActive = false;
    };
  }, [fallbackErrorMessage, fetchPage, page, pageSize]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await loadPage(page);
  }, [loadPage, page]);

  const setPage = useCallback((nextPage: number) => {
    setIsLoading(true);
    setError(null);
    setPageState(nextPage);
  }, []);

  return {
    data,
    error,
    isLoading,
    page,
    pageSize,
    refresh,
    setPage,
  };
}
