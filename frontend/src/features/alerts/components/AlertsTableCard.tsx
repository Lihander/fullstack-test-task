import { DataTableCard } from "@/components/DataTableCard";
import type { AlertsTableCardProps } from "./AlertsTableCard.types";
import { alertsTableColumns } from "./alertsTableColumns";

export function AlertsTableCard({
  data,
  isLoading,
  error,
  onRetry,
  onPageChange,
}: AlertsTableCardProps) {
  const total = data?.total ?? 0;
  const items = data?.items ?? [];

  return (
    <DataTableCard
      className="shadow-sm border-0"
      title="Сообщения"
      total={total}
      rows={items}
      columns={alertsTableColumns}
      emptyMessage="Сообщений пока нет"
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      getRowKey={(alert) => alert.id}
      currentPage={data?.page ?? 1}
      totalPages={data?.pages ?? 0}
      onPageChange={onPageChange}
    />
  );
}
