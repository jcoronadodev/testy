"use client";

import { useState } from "react";
import useSWR from "swr";
import type { TestCase } from "@prisma/client";
import TestCaseForm from "./TestCaseForm";
import TestCaseTable from "./TestCaseTable";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function TestCasesPage() {
  const { data, mutate, isLoading } = useSWR<TestCase[]>("/api/test-cases", fetcher);
  const [editing, setEditing] = useState<number | null>(null);

  const rows = Array.isArray(data) ? data : [];

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this test case?")) return;
    await fetch(`/api/test-cases/${id}`, { method: "DELETE" });
    mutate();
  };

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">QA Test Cases (SCO/POS)</h1>
        <button
          className="rounded-lg border px-4 py-2 hover:bg-gray-50"
          onClick={() => setEditing(null)}
        >
          New
        </button>
      </header>

      <TestCaseForm
        editing={editing}
        data={rows}
        onSaved={() => {
          setEditing(null);
          mutate();
        }}
        onCancel={() => setEditing(null)}
      />

      <TestCaseTable
        rows={rows}
        isLoading={isLoading}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}
