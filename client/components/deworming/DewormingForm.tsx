import React from "react";

type Props = {
  onSubmit?: (data: any) => void;
  initialValues?: any;
};

export default function DewormingForm({ onSubmit }: Props) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit({}); }}>
      <div className="p-4 bg-white rounded shadow">Deworming form (stub)</div>
    </form>
  );
}
