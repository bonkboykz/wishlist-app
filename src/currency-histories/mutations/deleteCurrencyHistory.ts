import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteCurrencyHistory = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteCurrencyHistory),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const currencyHistory = await db.currencyHistory.deleteMany({
      where: { id },
    });

    return currencyHistory;
  }
);
