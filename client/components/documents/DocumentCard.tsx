import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { MedicalDocument } from "@/types/document";
import {
  documentCategoryLabels,
  documentCategoryIcons,
  formatFileSize,
  isImageFile,
  formatDate,
} from "@/utils/documentMeta";

interface DocumentCardProps {
  document: MedicalDocument;
  index?: number;
}

export default function DocumentCard({ document, index = 0 }: DocumentCardProps) {
  const Icon = documentCategoryIcons[document.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link
        to={`/documents/${document.id}`}
        className="group flex flex-col gap-3 overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
      >
        {isImageFile(document.fileType) ? (
          <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
            <img
              src={document.fileUrl}
              alt={document.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted">
            <Icon size={40} strokeWidth={1.5} className="text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-col gap-1 px-4 pb-4">
          <h3 className="truncate font-semibold text-foreground">
            {document.title}
          </h3>
          <span className="text-xs text-muted-foreground">
            {documentCategoryLabels[document.category]} ·{" "}
            {formatFileSize(document.fileSizeBytes)}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(document.createdAt)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
