import { render, screen } from "@testing-library/react";

import type { PaginatedResponse } from "@/shared/api";
import { AlertLevel, AlertMessageCode } from "@/shared/types";
import { AlertsTableCard } from "@/features/alerts/components/AlertsTableCard";
import type { AlertItem } from "@/features/alerts/types";


const alertsPage: PaginatedResponse<AlertItem> = {
  items: [
    {
      id: 7,
      file_id: "file-7",
      level: AlertLevel.Warning,
      message: AlertMessageCode.FileRequiresAttention,
      created_at: "2026-04-17T12:00:00.000Z",
    },
  ],
  page: 1,
  page_size: 5,
  total: 7,
  pages: 2,
};


describe("AlertsTableCard", () => {
  it("renders alerts and server total", () => {
    render(
      <AlertsTableCard
        data={alertsPage}
        error={null}
        isLoading={false}
        onPageChange={() => undefined}
        onRetry={() => undefined}
      />,
    );

    expect(screen.getByText("Файл требует внимания")).toBeInTheDocument();
    expect(screen.getByText("Всего записей: 7")).toBeInTheDocument();
  });

  it("renders an empty state without alerts", () => {
    render(
      <AlertsTableCard
        data={{ ...alertsPage, items: [], total: 0, pages: 0 }}
        error={null}
        isLoading={false}
        onPageChange={() => undefined}
        onRetry={() => undefined}
      />,
    );

    expect(screen.getByText("Сообщений пока нет")).toBeInTheDocument();
  });
});
