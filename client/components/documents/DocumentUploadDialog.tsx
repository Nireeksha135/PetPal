import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormSelect";
import FormTextarea from "@/components/FormTextarea";
import PetSelect from "@/components/medicine/PetSelect";
import type { PetListItem } from "@/types/pet";
import type { DocumentCategory } from "@/types/document";
import { documentCategoryOptions, formatFileSize } from "@/utils/documentMeta";

interface DocumentUploadDialogProps {
  open: boolean;
  pets: PetListItem[];
  defaultPetId?: string;
  isUploading: boolean;
  serverError?: string | null;
  onUpload: (data: {
    petId: string;
    title: string;
    category: DocumentCategory;
    notes?: string;
    file: File;
  }) => void;
  onCancel: () => void;
}

export default function DocumentUploadDialog({
  open,
  pets,
  defaultPetId,
  isUploading,
  serverError,
  onUpload,
  onCancel,
}: DocumentUploadDialogProps) {
  const [petId, setPetId] = useState(defaultPetId ?? pets[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("other");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const dropped = acceptedFiles[0];
    if (dropped) {
      setFile(dropped);
      if (!title) setTitle(dropped.name.replace(/\.[^/.]+$/, ""));
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024,
  });

  const canSubmit = petId && title.trim() && file && !isUploading;

  const handleSubmit = () => {
    if (!canSubmit || !file) return;
    onUpload({ petId, title: title.trim(), category, notes: notes || undefined, file });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-elevated"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Upload Document</h3>
              <button
                type="button"
                onClick={onCancel}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X size={16} />
              </button>
            </div>

            {serverError && (
              <div className="mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div
                {...getRootProps()}
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-6 py-8 text-center transition-colors hover:border-primary/50"
              >
                <input {...getInputProps()} />
                {file ? (
                  <>
                    <FileIcon size={28} className="text-primary" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={28} className="text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {isDragActive ? "Drop the file here" : "Click or drag a file to upload"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PDF, JPEG, PNG, or WEBP — up to 15MB
                    </span>
                  </>
                )}
              </div>

              <PetSelect
                pets={pets}
                label="Pet"
                name="petId"
                defaultValue={petId}
                onChange={(e) => setPetId(e.target.value)}
              />

              <FormField
                label="Title"
                placeholder="Blood test results — March 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <FormSelect
                label="Category"
                options={documentCategoryOptions}
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              />

              <FormTextarea
                label="Notes (optional)"
                placeholder="Any context worth remembering"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={onCancel} disabled={isUploading}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                isLoading={isUploading}
                disabled={!canSubmit}
              >
                Upload
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
