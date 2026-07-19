import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import { useAllDocuments } from "@/hooks/useDocuments";
import { usePets } from "@/hooks/usePets";
import { useUploadDocument } from "@/hooks/useUploadDocument";
import DocumentCard from "@/components/documents/DocumentCard";
import DocumentCardSkeleton from "@/components/documents/DocumentCardSkeleton";
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";
import FormSelect from "@/components/FormSelect";
import { getApiErrorMessage } from "@/services/api";
import { documentCategoryOptions } from "@/utils/documentMeta";
import type { DocumentCategory } from "@/types/document";

export default function DocumentsList() {
  const { data: documents, isLoading, isError, refetch } = useAllDocuments();
  const { data: pets } = usePets();
  const [searchParams] = useSearchParams();
  const preselectedPetId = searchParams.get("petId") ?? undefined;
  const navigate = useNavigate();

  const [petFilter, setPetFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadMutation = useUploadDocument();

  const filtered = documents?.filter(
    (d) =>
      (petFilter === "all" || d.petId === petFilter) &&
      (categoryFilter === "all" || d.category === categoryFilter),
  );

  const petOptions = [
    { value: "all", label: "All Pets" },
    ...(pets ?? []).map((p) => ({ value: p.id, label: p.name })),
  ];
  const catOptions = [{ value: "all", label: "All Categories" }, ...documentCategoryOptions];

  const handleUpload = (data: {
    petId: string;
    title: string;
    category: DocumentCategory;
    notes?: string;
    file: File;
  }) => {
    setUploadError(null);
    uploadMutation.mutate(data, {
      onSuccess: (doc) => {
        setUploadOpen(false);
        navigate(`/documents/${doc.id}`);
      },
      onError: (error) => setUploadError(getApiErrorMessage(error)),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Medical Documents
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Store lab results, X-rays, prescriptions, and more.
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)} disabled={!pets || pets.length === 0}>
          <Plus size={16} />
          Upload Document
        </Button>
      </div>

      {(pets?.length ?? 0) > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-md">
          <FormSelect
            label="Filter by pet"
            options={petOptions}
            value={petFilter}
            onChange={(e) => setPetFilter(e.target.value)}
          />
          <FormSelect
            label="Filter by category"
            options={catOptions}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
      )}

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <DocumentCardSkeleton key={i} />
          ))}
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Upload lab results, X-rays, prescriptions, or insurance papers to keep everything in one place."
          action={
            (pets?.length ?? 0) > 0 ? (
              <Button size="sm" onClick={() => setUploadOpen(true)}>
                <Plus size={14} />
                Upload Document
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((document, i) => (
            <DocumentCard key={document.id} document={document} index={i} />
          ))}
        </div>
      )}

      {pets && (
        <DocumentUploadDialog
          open={uploadOpen}
          pets={pets}
          defaultPetId={preselectedPetId}
          isUploading={uploadMutation.isPending}
          serverError={uploadError}
          onUpload={handleUpload}
          onCancel={() => {
            setUploadOpen(false);
            setUploadError(null);
          }}
        />
      )}
    </div>
  );
}
