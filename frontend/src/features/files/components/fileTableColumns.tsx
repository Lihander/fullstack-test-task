import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

import type { DataTableColumn } from "@/components/DataTableCard";
import { formatDate, formatMimeType, formatSize, truncateText } from "@/shared/format";
import { BadgeVariant, ScanStatus } from "@/shared/types";
import { processingStatusMap, scanStatusMap, UNKNOWN_CODE } from "@/shared/utils";

import { getDownloadUrl } from "../api";
import type { FileItem } from "../types";
import type { CreateFileTableColumnsOptions } from "./FileTableCard.types";
import { getScanReasonLabel } from "../utils";

export function createFileTableColumns({
  deletingFileId,
  onDelete,
}: CreateFileTableColumnsOptions): DataTableColumn<FileItem>[] {
  return [
    {
      key: "title",
      header: "Название",
      render: (file) => (
        <>
          <div className="fw-semibold" title={file.title}>
            {truncateText(file.title)}
          </div>
          <div className="small text-secondary">{file.id}</div>
        </>
      ),
    },
    {
      key: "original_name",
      header: "Файл",
      render: (file) => <span title={file.original_name}>{truncateText(file.original_name)}</span>,
    },
    {
      key: "mime_type",
      header: "Тип MIME",
      render: (file) => <span title={file.mime_type}>{formatMimeType(file.mime_type)}</span>,
    },
    {
      key: "size",
      header: "Размер",
      render: (file) => formatSize(file.size),
    },
    {
      key: "processing_status",
      header: "Статус",
      render: (file) => (
        <Badge bg={processingStatusMap[file.processing_status]?.variant ?? BadgeVariant.Secondary}>
          {processingStatusMap[file.processing_status]?.label ?? UNKNOWN_CODE}
        </Badge>
      ),
    },
    {
      key: "scan_status",
      header: "Проверка",
      render: (file) => (
        <div className="d-flex flex-column gap-1">
          <Badge
            bg={scanStatusMap[file.scan_status ?? ScanStatus.Pending]?.variant ?? BadgeVariant.Secondary}
          >
            {scanStatusMap[file.scan_status ?? ScanStatus.Pending]?.label ?? UNKNOWN_CODE}
          </Badge>
          <span className="small text-secondary">{getScanReasonLabel(file)}</span>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "Создан",
      render: (file) => formatDate(file.created_at),
    },
    {
      key: "actions",
      header: "",
      cellClassName: "text-nowrap",
      render: (file) => {
        const isDeleting = deletingFileId === file.id;

        return (
          <div className="d-flex gap-2">
            <Button as="a" href={getDownloadUrl(file.id)} variant="outline-primary" size="sm">
              Скачать
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              disabled={isDeleting}
              onClick={() => onDelete(file.id)}
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </div>
        );
      },
    },
  ];
}
