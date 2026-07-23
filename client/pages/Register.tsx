import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="mb-4 text-2xl font-semibold">Register (Dev stub)</h1>
      <label className="block mb-2">
        <span className="text-sm">Full name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
      </label>
      <div className="flex gap-2">
        <Button onClick={() => navigate("/dashboard")}>Create account</Button>
        <Button variant="secondary" onClick={() => navigate("/login")}>Back</Button>
      </div>
    </div>
  );
}
