import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteShop = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteShop),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const shop = await db.shop.deleteMany({ where: { id } });

    return shop;
  }
);
