import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateShop = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export default resolver.pipe(resolver.zod(CreateShop), resolver.authorize(), async (input, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const shop = await db.shop.create({ data: { ...input, ownerId: ctx.session.userId } });

  return shop;
});
