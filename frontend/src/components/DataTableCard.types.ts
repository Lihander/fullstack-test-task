import type { ReactNode } from "react";

export type DataTableColumn<Row> = {
  key: string;
  header: ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  render: (row: Row) => ReactNode;
};

export type DataTableCardProps<Row> = {
  title: string;
  total: number;
  rows: Row[];
  columns: DataTableColumn<Row>[];
  emptyMessage: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  getRowKey: (row: Row) => string | number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};
