import { z } from "zod";

export const testCaseSchema = z.object({
  externalId: z.string().min(1).max(50).optional().or(z.literal("")),
  title: z.string().min(1, "Title is required"),
  scenario: z.string().min(1, "Scenario is required"),
  testData: z.string().min(1, "Test data is required"),
  terminal: z.string().min(1, "Terminal is required"),
  testDate: z.coerce.date(),
  trx: z.string().optional().or(z.literal("")),
  receiptAmount: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined || v === "" ? undefined : Number(v)))
    .refine((v) => v === undefined || !Number.isNaN(v), "Invalid amount"),
  cmrPoints: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined || v === "" ? undefined : Number(v)))
    .refine((v) => v === undefined || Number.isInteger(v), "Invalid points"),
  cardType: z.enum(["CMR", "VISA", "MASTERCARD", "DEBIT", "OTHER"]).optional(),
  cardTerminal: z.string().optional().or(z.literal("")),
  expectedResult: z.string().min(1, "Expected result is required"),
  actualResult: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  channel: z.enum(["SCO", "POS"]),
});

export type TestCaseInput = z.infer<typeof testCaseSchema>;
