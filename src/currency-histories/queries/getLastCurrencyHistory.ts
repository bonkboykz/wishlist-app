import { NotFoundError } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import { getConversionRate } from "integrations/currencyConverterApi";
import { isSameDay } from "date-fns";

const GetLastCurrencyHistory = z.object({
  from: z.string(),
  to: z.string(),
});

export default resolver.pipe(resolver.zod(GetLastCurrencyHistory), async ({ from, to }) => {
  let currencyHistory = await db.currencyHistory.findFirst({
    where: {
      transactionCurrency: from,
      settlementCurrency: to,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!currencyHistory || !isSameDay(currencyHistory.createdAt, new Date())) {
    const conversionRate = await getConversionRate(from, to);

    await db.currencyHistory.createMany({
      data: [
        {
          transactionCurrency: from,
          settlementCurrency: to,
          rate: conversionRate[from + "_" + to] ?? 1.0,
        },
        {
          transactionCurrency: to,
          settlementCurrency: from,
          rate: conversionRate[to + "_" + from] ?? 1.0,
        },
      ],
    });
  }

  currencyHistory = await db.currencyHistory.findFirst({
    where: {
      transactionCurrency: from,
      settlementCurrency: to,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return currencyHistory;
});
