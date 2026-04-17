import Badge from "react-bootstrap/Badge";

import type { DataTableColumn } from "@/components/DataTableCard";
import { formatDate } from "@/shared/format";
import { BadgeVariant } from "@/shared/types";
import { alertLevelMap, alertMessageMap, UNKNOWN_CODE } from "@/shared/utils";

import type { AlertItem } from "../types";

export const alertsTableColumns: DataTableColumn<AlertItem>[] = [
  {
    key: "id",
    header: "ID",
    render: (alert) => alert.id,
  },
  {
    key: "file_id",
    header: "ID файла",
    cellClassName: "small",
    render: (alert) => alert.file_id,
  },
  {
    key: "level",
    header: "Уровень",
    render: (alert) => (
      <Badge bg={alertLevelMap[alert.level]?.variant ?? BadgeVariant.Secondary}>
        {alertLevelMap[alert.level]?.label ?? UNKNOWN_CODE}
      </Badge>
    ),
  },
  {
    key: "message",
    header: "Сообщение",
    render: (alert) => alertMessageMap[alert.message] ?? UNKNOWN_CODE,
  },
  {
    key: "created_at",
    header: "Создан",
    render: (alert) => formatDate(alert.created_at),
  },
];
