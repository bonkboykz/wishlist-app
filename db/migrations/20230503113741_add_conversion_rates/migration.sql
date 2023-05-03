-- CreateTable
CREATE TABLE "CurrencyHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "transactionCurrency" TEXT NOT NULL,
    "settlementCurrency" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CurrencyHistory_pkey" PRIMARY KEY ("id")
);
