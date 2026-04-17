import type { UploadFilePayload } from "@/features/files/types";

export type UploadFileModalProps = {
  error: string | null;
  isSubmitting: boolean;
  onHide: () => void;
  onSubmit: (payload: UploadFilePayload) => Promise<void>;
  show: boolean;
};
