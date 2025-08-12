-- CreateTable
CREATE TABLE "TestCase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "testData" TEXT NOT NULL,
    "terminal" TEXT NOT NULL,
    "testDate" DATETIME NOT NULL,
    "trx" TEXT,
    "receiptAmount" DECIMAL,
    "cmrPoints" INTEGER,
    "cardType" TEXT,
    "cardTerminal" TEXT,
    "expectedResult" TEXT NOT NULL,
    "actualResult" TEXT,
    "notes" TEXT,
    "channel" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
