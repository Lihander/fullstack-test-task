import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { PaginatedResponse } from "@/shared/api";
import { ProcessingStatus, ScanReasonCode, ScanStatus } from "@/shared/types";
import { FileTableCard } from "@/features/files/components/FileTableCard";
import type { FileItem } from "@/features/files/types";


const filePage: PaginatedResponse<FileItem> = {
  items: [
    {
      id: "file-1",
      title: "Contract",
      original_name: "contract.pdf",
      mime_type: "application/pdf",
      size: 4096,
      processing_status: ProcessingStatus.Processed,
      scan_status: ScanStatus.Clean,
      scan_reason_codes: [],
      scan_details: "no threats found",
      metadata_json: null,
      requires_attention: false,
      created_at: "2026-04-17T10:00:00.000Z",
      updated_at: "2026-04-17T10:00:00.000Z",
    },
  ],
  page: 2,
  page_size: 5,
  total: 12,
  pages: 3,
};


describe("FileTableCard", () => {
  it("renders total count from the paginated response", () => {
    render(
      <FileTableCard
        data={filePage}
        deletingFileId={null}
        error={null}
        isLoading={false}
        onDelete={() => undefined}
        onPageChange={() => undefined}
        onRetry={() => undefined}
      />,
    );

    expect(screen.getByText("Contract")).toBeInTheDocument();
    expect(screen.getByText(/Всего записей:\s*12/)).toBeInTheDocument();
  });

  it("renders an empty state when there are no items", () => {
    render(
      <FileTableCard
        data={{ ...filePage, items: [], total: 0, pages: 0 }}
        deletingFileId={null}
        error={null}
        isLoading={false}
        onDelete={() => undefined}
        onPageChange={() => undefined}
        onRetry={() => undefined}
      />,
    );

    expect(screen.getByText("Файлы пока не загружены")).toBeInTheDocument();
  });

  it("renders scan reason labels from codes", () => {
    render(
      <FileTableCard
        data={{
          ...filePage,
          items: [
            {
              ...filePage.items[0],
              scan_status: ScanStatus.Suspicious,
              scan_reason_codes: [ScanReasonCode.SuspiciousExtension, ScanReasonCode.FileTooLarge],
            },
          ],
        }}
        deletingFileId={null}
        error={null}
        isLoading={false}
        onDelete={() => undefined}
        onPageChange={() => undefined}
        onRetry={() => undefined}
      />,
    );

    expect(screen.getByText("Подозрительное расширение файла, Файл превышает допустимый размер")).toBeInTheDocument();
  });

  it("calls delete handler when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <FileTableCard
        data={filePage}
        deletingFileId={null}
        error={null}
        isLoading={false}
        onDelete={onDelete}
        onPageChange={() => undefined}
        onRetry={() => undefined}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Удалить" }));

    expect(onDelete).toHaveBeenCalledWith("file-1");
  });

  it("truncates long file title and name to 100 characters", () => {
    const longTitle = "T".repeat(120);
    const longFileName = "F".repeat(120);

    render(
      <FileTableCard
        data={{
          ...filePage,
          items: [
            {
              ...filePage.items[0],
              title: longTitle,
              original_name: longFileName,
            },
          ],
        }}
        deletingFileId={null}
        error={null}
        isLoading={false}
        onDelete={() => undefined}
        onPageChange={() => undefined}
        onRetry={() => undefined}
      />,
    );

    expect(screen.getByText(`${"T".repeat(97)}...`)).toBeInTheDocument();
    expect(screen.getByText(`${"F".repeat(97)}...`)).toBeInTheDocument();
  });
});
