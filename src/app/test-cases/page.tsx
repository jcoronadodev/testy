"use client";

import { useEffect, useMemo, useState } from "react";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { testCaseSchema, type TestCaseInput } from "@/lib/validation";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function TestCasesPage() {
  const { data, mutate, isLoading } = useSWR("/api/test-cases", fetcher);
  const [editing, setEditing] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestCaseInput>({
    resolver: zodResolver(testCaseSchema) as Resolver<TestCaseInput>,
    // (opcional, recomendable) evita tener que hacer reset inicial:
    defaultValues: {
      channel: "SCO",
      testDate: new Date(), // RHF + valueAsDate mantiene Date
    } as Partial<TestCaseInput>,
  });

  useEffect(() => {
    if (editing && data) {
      const item = data.find((x: any) => x.id === editing);
      if (item) {
        reset({
          externalId: item.externalId ?? "",
          title: item.title,
          scenario: item.scenario,
          testData: item.testData,
          terminal: item.terminal,
          testDate: new Date(item.testDate),
          trx: item.trx ?? "",
          receiptAmount: item.receiptAmount ?? undefined,
          cmrPoints: item.cmrPoints ?? undefined,
          cardType: item.cardType ?? undefined,
          cardTerminal: item.cardTerminal ?? "",
          expectedResult: item.expectedResult,
          actualResult: item.actualResult ?? "",
          notes: item.notes ?? "",
          channel: item.channel,
        });
      }
    } else {
      reset({
        channel: "SCO",
        testDate: new Date(),
      } as any);
    }
  }, [editing, data, reset]);

  const onSubmit: SubmitHandler<TestCaseInput> = async (values) => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/test-cases/${editing}` : "/api/test-cases";
    const payload = { ...values, testDate: new Date(values.testDate) };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(await res.json());
      return;
    }
    setEditing(null);
    reset();
    mutate();
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this test case?")) return;
    await fetch(`/api/test-cases/${id}`, { method: "DELETE" });
    mutate();
  };

  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);

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

      {/* Form */}
      <section className="rounded-2xl border p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium">External ID</label>
            <input
              className="w-full rounded border px-3 py-2"
              {...register("externalId")}
            />
            {errors.externalId && (
              <p className="text-sm text-red-600">
                {errors.externalId.message as any}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              className="w-full rounded border px-3 py-2"
              {...register("title")}
              required
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Channel</label>
            <select
              className="w-full rounded border px-3 py-2"
              {...register("channel")}
            >
              <option value="SCO">SCO</option>
              <option value="POS">POS</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium">Scenario</label>
            <textarea
              className="w-full rounded border px-3 py-2"
              {...register("scenario")}
              required
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium">Test Data</label>
            <textarea
              className="w-full rounded border px-3 py-2"
              {...register("testData")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Terminal</label>
            <input
              className="w-full rounded border px-3 py-2"
              {...register("terminal")}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Test Date</label>
            <input
              type="date"
              className="w-full rounded border px-3 py-2"
              {...register("testDate", { valueAsDate: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">TRX</label>
            <input
              type="date"
              className="w-full rounded border px-3 py-2"
              {...register("testDate", { valueAsDate: true })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Receipt Amount</label>
            <input
              type="number"
              step="0.01"
              className="w-full rounded border px-3 py-2"
              {...register("receiptAmount")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">CMR Points</label>
            <input
              type="number"
              className="w-full rounded border px-3 py-2"
              {...register("cmrPoints")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Card Type</label>
            <select
              className="w-full rounded border px-3 py-2"
              {...register("cardType")}
            >
              <option value="">—</option>
              <option value="CMR">CMR</option>
              <option value="VISA">VISA</option>
              <option value="MASTERCARD">MASTERCARD</option>
              <option value="DEBIT">DEBIT</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Card Terminal</label>
            <input
              className="w-full rounded border px-3 py-2"
              {...register("cardTerminal")}
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium">Expected Result</label>
            <textarea
              className="w-full rounded border px-3 py-2"
              {...register("expectedResult")}
              required
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium">Actual Result</label>
            <textarea
              className="w-full rounded border px-3 py-2"
              {...register("actualResult")}
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              className="w-full rounded border px-3 py-2"
              {...register("notes")}
            />
          </div>

          <div className="md:col-span-3 flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              {editing ? "Update" : "Create"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Table */}
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
            {rows.map((r: any) => (
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
                      onClick={() => setEditing(r.id)}
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
    </div>
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
