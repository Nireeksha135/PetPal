import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Download, ExternalLink } from "lucide-react";
import { useDocument } from "@/hooks/useDocuments";
import { useDeleteDocument } from "@/hooks/useUploadDocument";
import { usePet } from "@/hooks/usePet";
import Skeleton from "@/components/Skeleton";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";
import DeletePetDialog from "@/components/pets/DeletePetDialog";
import PetInfoRow from "@/components/pets/PetInfoRow";
import {
  documentCategoryLabels,
  documentCategoryIcons,
  formatFileSize,
  isImageFile,
  isPdfFile,
  formatDate,
} from "@/utils/documentMeta";
import { Tag, HardDrive, Calendar, PawPrint } from "lucide-react";

export default function DocumentDetail() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { data: document, isLoading, isError, refetch } = useDocument(documentId);
  const { data: pet } = usePet(document?.petId);
  const deleteMutation = useDeleteDocument();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !document) {
    return <ErrorState title="Document not found" onRetry={() => refetch()} />;
  }

  const Icon = documentCategoryIcons[document.category];

  const handleDelete = () => {
    deleteMutation.mutate(
      { documentId: document.id, petId: document.petId },
      { onSuccess: () => navigate("/documents", { replace: true }) },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/documents"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Medical Documents
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {isImageFile(document.fileType) ? (
            <img
              src={document.fileUrl}
              alt={document.title}
              className="w-full rounded-2xl object-cover shadow-card"
            />
          ) : isPdfFile(document.fileType) ? (
            <div className="flex h-96 flex-col items-center justify-center gap-3 rounded-2xl bg-card shadow-card">
              <Icon size={48} strokeWidth={1.5} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">PDF Document</p>
              <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm">
                  <ExternalLink size={14} />
                  Open PDF
                </Button>
              </a>
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center rounded-2xl bg-card shadow-card">
              <Icon size={48} strokeWidth={1.5} className="text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl bg-card p-6 shadow-card">
            <h1 className="text-xl font-bold tracking-tight">
              {document.title}
            </h1>
            <div className="mt-4 divide-y divide-border">
              <PetInfoRow
                icon={Tag}
                label="Category"
                value={documentCategoryLabels[document.category]}
              />
              <PetInfoRow
                icon={PawPrint}
                label="Pet"
                value={pet?.name ?? "—"}
              />
              <PetInfoRow
                icon={HardDrive}
                label="File Size"
                value={formatFileSize(document.fileSizeBytes)}
              />
              <PetInfoRow
                icon={Calendar}
                label="Uploaded"
                value={formatDate(document.createdAt)}
              />
            </div>

            {document.notes && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  {document.notes}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              
                href={document.fileUrl}
                download={document.fileName}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" fullWidth>
                  <Download size={16} />
                  Download
                </Button>
              </a>
              <Button
                variant="destructive"
                fullWidth
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 size={16} />
                Delete Document
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DeletePetDialog
        open={deleteDialogOpen}
        petName={document.title}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
