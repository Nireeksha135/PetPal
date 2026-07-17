import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, Loader2 } from "lucide-react";
import type { PetSpecies } from "@/types/pet";
import PetAvatar from "./PetAvatar";
import { cn } from "@/utils/cn";

interface AvatarUploaderProps {
  name: string;
  species: PetSpecies;
  avatarUrl: string | null;
  onUpload: (file: File) => Promise<unknown>;
  disabled?: boolean;
}

export default function AvatarUploader({
  name,
  species,
  avatarUrl,
  onUpload,
  disabled = false,
}: AvatarUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setError(null);
      setIsUploading(true);
      try {
        await onUpload(file);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: disabled || isUploading,
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        {...getRootProps()}
        className={cn(
          "group relative cursor-pointer rounded-2xl transition-opacity",
          (disabled || isUploading) && "cursor-not-allowed opacity-70",
        )}
      >
        <input {...getInputProps()} />
        <PetAvatar
          name={name}
          species={species}
          avatarUrl={avatarUrl}
          size="xl"
        />
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
            isDragActive && "opacity-100",
          )}
        >
          {isUploading ? (
            <Loader2 size={22} className="animate-spin text-white" />
          ) : (
            <Camera size={22} className="text-white" />
          )}
        </div>
      </div>
      <span className="text-xs text-muted-foreground">
        Click or drag a photo to upload
      </span>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
