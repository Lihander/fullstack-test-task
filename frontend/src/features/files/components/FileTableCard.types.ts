import type { PaginatedResponse } from "@/shared/api";

import type { FileItem } from "../types";

export type FileTableCardProps = {
  data: PaginatedResponse<FileItem> | null;
  deletingFileId: string | null;
  isLoading: boolean;
  onDelete: (fileId: string) => void;
  error: string | null;
  onRetry: () => void;
  onPageChange: (page: number) => void;
};

export type CreateFileTableColumnsOptions = {
  deletingFileId: string | null;
  onDelete: (fileId: string) => void;
};
