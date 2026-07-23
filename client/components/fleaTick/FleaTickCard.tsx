import React from "react";

type Props = {
  title?: string;
  date?: string;
};

export default function FleaTickCard({ title = "Flea/Tick" }: Props) {
  return (
    <div className="p-3 border rounded">{title} (stub)</div>
  );
}
