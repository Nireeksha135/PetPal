import type { LucideIcon } from "lucide-react";
import {
  FlaskConical,
  Scan,
  Pill,
  ShieldCheck,
  Syringe,
  Receipt,
  FileText,
} from "lucide-react";
import type { DocumentCategory } from "@/types/document";

export const documentCategoryLabels: Record<DocumentCategory, string> = {
  lab_result: "Lab Result",
  xray: "X-Ray",
  prescription: "Prescription",
  insurance: "Insurance",
  vaccination_certificate: "Vaccination Certificate",
  invoice: "Invoice",
  other: "Other",
};

export const documentCategoryIcons: Record<DocumentCategory, LucideIcon> = {
  lab_result: FlaskConical,
  xray: Scan,
  prescription: Pill,
  insurance: ShieldCheck,
  vaccination_certificate: Syringe,
  invoice: Receipt,
  other: FileText,
};

export const documentCategoryOptions = (
  Object.keys(documentCategoryLabels) as DocumentCategory[]
).map((value) => ({ value, label: documentCategoryLabels[value] }));

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isImageFile(fileType: string): boolean {
  return fileType.startsWith("image/");
}

export function isPdfFile(fileType: string): boolean {
  return fileType === "application/pdf";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
