import { useMemo } from "react";

import { DataTableCard } from "@/components/DataTableCard";

import type { FileTableCardProps } from "./FileTableCard.types";
import { createFileTableColumns } from "./fileTableColumns";

export function FileTableCard({
  data,
  deletingFileId,
  isLoading,
  onDelete,
  error,
  onRetry,
  onPageChange,
}: FileTableCardProps) {
  const total = data?.total ?? 0;
  const items = data?.items ?? [];
  const columns = useMemo(
    () =>
      createFileTableColumns({
        deletingFileId,
        onDelete,
      }),
    [deletingFileId, onDelete],
  );

  return (
    <DataTableCard
      className="shadow-sm border-0 mb-4"
      title="Файлы"
      total={total}
      rows={items}
      columns={columns}
      emptyMessage="Файлы пока не загружены"
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      getRowKey={(file) => file.id}
      currentPage={data?.page ?? 1}
      totalPages={data?.pages ?? 0}
      onPageChange={onPageChange}
    />
  );
}
