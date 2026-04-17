import { buildApiUrl, fetchJson, type PaginatedResponse } from "@/shared/api";
import { apiErrorMap, UNKNOWN_CODE } from "@/shared/utils";

import type { FileItem, UploadFilePayload } from "./types";

export async function getFilesPage(page: number, pageSize: number) {
  return fetchJson<PaginatedResponse<FileItem>>("/files", undefined, {
    page,
    page_size: pageSize,
  });
}

export async function uploadFile(payload: UploadFilePayload) {
  const formData = new FormData();
  formData.append("title", payload.title.trim());
  formData.append("file", payload.file);

  return fetchJson<FileItem>("/files", {
    method: "POST",
    body: formData,
  });
}

export async function deleteFile(fileId: string) {
  const response = await fetch(buildApiUrl(`/files/${fileId}`), {
    method: "DELETE",
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Не удалось выполнить запрос";

    try {
      const payload = (await response.json()) as { detail?: string };
      errorMessage = payload.detail ? (apiErrorMap[payload.detail] ?? UNKNOWN_CODE) : errorMessage;
    } catch {
      // ignore invalid JSON error bodies
    }

    throw new Error(errorMessage);
  }
}

export function getDownloadUrl(fileId: string) {
  return buildApiUrl(`/files/${fileId}/download`);
}
