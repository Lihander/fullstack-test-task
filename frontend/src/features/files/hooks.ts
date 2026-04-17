import { usePaginatedResource } from "@/shared/usePaginatedResource";

import { getFilesPage } from "./api";
export function useFiles(initialPageSize = 5) {
  return usePaginatedResource({
    fetchPage: getFilesPage,
    fallbackErrorMessage: "Не удалось загрузить файлы",
    initialPageSize,
  });
}
