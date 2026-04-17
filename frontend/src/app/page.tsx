"use client";

import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { AlertsTableCard } from "@/features/alerts/components/AlertsTableCard";
import { useAlerts } from "@/features/alerts/hooks";
import { FileTableCard } from "@/features/files/components/FileTableCard";
import { useFiles } from "@/features/files/hooks";
import { deleteFile, uploadFile } from "@/features/files/api";
import type { UploadFilePayload } from "@/features/files/types";
import { UploadFileModal } from "@/features/upload/components/UploadFileModal";


export default function Page() {
  const files = useFiles();
  const alerts = useAlerts();
  const [actionError, setActionError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRefresh() {
    setActionError(null);
    await Promise.all([files.refresh(), alerts.refresh()]);
  }

  async function handleUpload(payload: UploadFilePayload) {
    if (!payload.title.trim() || !payload.file) {
      setUploadError("Укажите название и выберите файл");
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    try {
      await uploadFile(payload);
      setActionError(null);
      setShowModal(false);
      if (files.page !== 1) {
        files.setPage(1);
      } else {
        await files.refresh();
      }
      await alerts.refresh();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Не удалось загрузить файл");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(fileId: string) {
    setActionError(null);
    setDeletingFileId(fileId);

    try {
      await deleteFile(fileId);

      const remainingItems = (files.data?.items.length ?? 0) - 1;
      if (remainingItems === 0 && files.page > 1) {
        files.setPage(files.page - 1);
      } else {
        await files.refresh();
      }

      await alerts.refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Не удалось удалить файл");
    } finally {
      setDeletingFileId(null);
    }
  }

  return (
    <Container fluid className="py-4 px-4 bg-light min-vh-100">
      <Row className="justify-content-center">
        <Col xxl={10} xl={11}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                <div>
                  <h1 className="h3 mb-2">Управление файлами</h1>
                  <p className="text-secondary mb-0">
                    Загрузка файлов, просмотр статусов обработки и ленты сообщений.
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" onClick={() => void handleRefresh()}>
                    Обновить
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setUploadError(null);
                      setShowModal(true);
                    }}
                  >
                    Добавить файл
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          {actionError ? (
            <Alert variant="danger" className="shadow-sm">
              {actionError}
            </Alert>
          ) : null}

          {uploadError ? (
            <Alert variant="danger" className="shadow-sm">
              {uploadError}
            </Alert>
          ) : null}

          <FileTableCard
            data={files.data}
            deletingFileId={deletingFileId}
            error={files.error}
            isLoading={files.isLoading}
            onDelete={(fileId) => void handleDelete(fileId)}
            onRetry={() => void files.refresh()}
            onPageChange={files.setPage}
          />

          <AlertsTableCard
            data={alerts.data}
            error={alerts.error}
            isLoading={alerts.isLoading}
            onRetry={() => void alerts.refresh()}
            onPageChange={alerts.setPage}
          />
        </Col>
      </Row>

      <UploadFileModal
        error={uploadError}
        isSubmitting={isSubmitting}
        onHide={() => {
          setShowModal(false);
          setUploadError(null);
        }}
        onSubmit={handleUpload}
        show={showModal}
      />
    </Container>
  );
}
