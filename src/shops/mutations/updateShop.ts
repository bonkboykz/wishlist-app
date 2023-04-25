import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateShop = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
});

export default resolver.pipe(
  resolver.zod(UpdateShop),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const shop = await db.shop.update({ where: { id }, data });

    return shop;
  }
);
