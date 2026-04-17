import {
  AlertLevel,
  AlertMessageCode,
  ApiErrorCode,
  BadgeVariant,
  ProcessingStatus,
  ScanReasonCode,
  ScanStatus,
} from "@/shared/types";

type BadgeMapEntry = {
  label: string;
  variant: BadgeVariant;
};

export const processingStatusMap: Record<ProcessingStatus, BadgeMapEntry> = {
  [ProcessingStatus.Uploaded]: {
    label: "Загружен",
    variant: BadgeVariant.Secondary,
  },
  [ProcessingStatus.Processing]: {
    label: "В обработке",
    variant: BadgeVariant.Warning,
  },
  [ProcessingStatus.Processed]: {
    label: "Обработан",
    variant: BadgeVariant.Success,
  },
  [ProcessingStatus.Failed]: {
    label: "Ошибка",
    variant: BadgeVariant.Danger,
  },
};

export const UNKNOWN_CODE = "Неизвестно";

export const alertLevelMap: Record<AlertLevel, BadgeMapEntry> = {
  [AlertLevel.Critical]: {
    label: "Критический",
    variant: BadgeVariant.Danger,
  },
  [AlertLevel.Warning]: {
    label: "Предупреждение",
    variant: BadgeVariant.Warning,
  },
  [AlertLevel.Info]: {
    label: "Информация",
    variant: BadgeVariant.Info,
  },
};

export const alertMessageMap: Record<AlertMessageCode, string> = {
  [AlertMessageCode.FileProcessingFailed]: "Ошибка обработки файла",
  [AlertMessageCode.FileRequiresAttention]: "Файл требует внимания",
  [AlertMessageCode.FileProcessedSuccessfully]: "Файл успешно обработан",
};

export const apiErrorMap: Record<ApiErrorCode, string> = {
  [ApiErrorCode.FileNotFound]: "Файл не найден",
  [ApiErrorCode.FileIsEmpty]: "Файл пустой",
  [ApiErrorCode.StoredFileNotFound]: "Файл в хранилище не найден",
};

export const scanStatusMap: Record<ScanStatus, BadgeMapEntry> = {
  [ScanStatus.Pending]: {
    label: "Ожидает проверки",
    variant: BadgeVariant.Secondary,
  },
  [ScanStatus.Clean]: {
    label: "Проверен",
    variant: BadgeVariant.Success,
  },
  [ScanStatus.Suspicious]: {
    label: "Подозрительный",
    variant: BadgeVariant.Warning,
  },
  [ScanStatus.Failed]: {
    label: "Ошибка проверки",
    variant: BadgeVariant.Danger,
  },
};

export const scanReasonMap: Record<ScanReasonCode, string> = {
  [ScanReasonCode.SuspiciousExtension]: "Подозрительное расширение файла",
  [ScanReasonCode.FileTooLarge]: "Файл превышает допустимый размер",
  [ScanReasonCode.PdfMimeTypeMismatch]: "MIME-тип не соответствует расширению PDF",
  [ScanReasonCode.StoredFileNotFound]: "Файл в хранилище не найден",
};
