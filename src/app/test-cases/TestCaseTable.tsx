"use client";

import * as React from "react";
import type { TestCase } from "@prisma/client";

interface TableProps {
  rows: TestCase[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TestCaseTable({ rows, isLoading, onEdit, onDelete }: TableProps) {
  return (
    <section className="rounded-2xl border overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <Th>ID</Th>
            <Th>External</Th>
            <Th>Title</Th>
            <Th>Channel</Th>
            <Th>Terminal</Th>
            <Th>TRX</Th>
            <Th>Amount</Th>
            <Th>CMR</Th>
            <Th>Date</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td className="p-3" colSpan={10}>
                Loading…
              </td>
            </tr>
          )}
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <Td>{r.id}</Td>
              <Td>{r.externalId || "—"}</Td>
              <Td className="max-w-[280px] truncate" title={r.title}>
                {r.title}
              </Td>
              <Td>{r.channel}</Td>
              <Td>{r.terminal}</Td>
              <Td>{r.trx || "—"}</Td>
              <Td>{r.receiptAmount ?? "—"}</Td>
              <Td>{r.cmrPoints ?? "—"}</Td>
              <Td>{new Date(r.testDate).toLocaleDateString()}</Td>
              <Td>
                <div className="flex gap-2">
                  <button
                    className="rounded border px-2 py-1"
                    onClick={() => onEdit(r.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded border px-2 py-1"
                    onClick={() => onDelete(r.id)}
                  >
                    Del
                  </button>
                </div>
              </Td>
            </tr>
          ))}
          {!isLoading && rows.length === 0 && (
            <tr>
              <td className="p-3" colSpan={10}>
                No test cases yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

function Th({
  children,
  className,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th {...rest} className={`p-3 text-left font-semibold ${className ?? ""}`}>
      {children}
    </th>
  );
}

function Td({
  children,
  className,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td {...rest} className={`p-3 align-top ${className ?? ""}`}>
      {children}
    </td>
  );
}
