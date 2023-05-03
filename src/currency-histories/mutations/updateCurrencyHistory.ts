import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateCurrencyHistory = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateCurrencyHistory),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const currencyHistory = await db.currencyHistory.update({
      where: { id },
      data,
    });

    return currencyHistory;
  }
);
