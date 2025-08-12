import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testCaseSchema } from "@/lib/validation";

export async function GET() {
  const items = await prisma.testCase.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = testCaseSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const created = await prisma.testCase.create({
    data: {
      externalId: data.externalId || null,
      title: data.title,
      scenario: data.scenario,
      testData: data.testData,
      terminal: data.terminal,
      testDate: data.testDate,
      trx: data.trx || null,
      receiptAmount:
        data.receiptAmount !== undefined ? data.receiptAmount : null,
      cmrPoints: data.cmrPoints !== undefined ? data.cmrPoints : null,
      cardType: data.cardType || null,
      cardTerminal: data.cardTerminal || null,
      expectedResult: data.expectedResult,
      actualResult: data.actualResult || null,
      notes: data.notes || null,
      channel: data.channel,
    },
  });

  return NextResponse.json(created, { status: 201 });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const json = await req.json();
  const parsed = testCaseSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const updated = await prisma.testCase.update({
    where: { id },
    data: {
      externalId: data.externalId || null,
      title: data.title,
      scenario: data.scenario,
      testData: data.testData,
      terminal: data.terminal,
      testDate: data.testDate,
      trx: data.trx || null,
      receiptAmount:
        data.receiptAmount !== undefined ? data.receiptAmount : null,
      cmrPoints: data.cmrPoints !== undefined ? data.cmrPoints : null,
      cardType: data.cardType || null,
      cardTerminal: data.cardTerminal || null,
      expectedResult: data.expectedResult,
      actualResult: data.actualResult || null,
      notes: data.notes || null,
      channel: data.channel,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  await prisma.testCase.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
