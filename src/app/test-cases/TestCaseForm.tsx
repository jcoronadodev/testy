"use client";

import { useEffect } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TestCase } from "@prisma/client";
import { testCaseSchema, type TestCaseInput } from "@/lib/validation";

interface FormProps {
  editing: number | null;
  data: TestCase[];
  onSaved: () => void;
  onCancel: () => void;
}

function createDefaultValues(): TestCaseInput {
  return {
    externalId: "",
    title: "",
    scenario: "",
    testData: "",
    terminal: "",
    testDate: new Date(),
    trx: "",
    receiptAmount: undefined,
    cmrPoints: undefined,
    cardType: undefined,
    cardTerminal: "",
    expectedResult: "",
    actualResult: "",
    notes: "",
    channel: "SCO",
  };
}

export default function TestCaseForm({ editing, data, onSaved, onCancel }: FormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestCaseInput>({
    resolver: zodResolver(testCaseSchema) as Resolver<TestCaseInput>,
    defaultValues: createDefaultValues(),
  });

  useEffect(() => {
    if (editing) {
      const item = data.find((x) => x.id === editing);
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
      reset(createDefaultValues());
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
    onSaved();
    reset(createDefaultValues());
  };

  return (
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
            <p className="text-sm text-red-600">{errors.externalId.message}</p>
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
            className="w-full rounded border px-3 py-2"
            {...register("trx")}
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
              onClick={onCancel}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
