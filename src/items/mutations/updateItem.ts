import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateItem = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  bought: z.boolean().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
});

export default resolver.pipe(
  resolver.zod(UpdateItem),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const item = await db.item.update({ where: { id }, data });

    return item;
  }
);
