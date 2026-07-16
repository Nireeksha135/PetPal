import type { LucideIcon } from "lucide-react";

interface PetInfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export default function PetInfoRow({ icon: Icon, label, value }: PetInfoRowProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Icon size={16} strokeWidth={2} />
        {label}
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
