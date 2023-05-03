import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateCurrencyHistory = z.object({
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateCurrencyHistory),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const currencyHistory = await db.currencyHistory.create({ data: input });

    return currencyHistory;
  }
);
