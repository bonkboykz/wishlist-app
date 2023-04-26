import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateItem = z.object({
  title: z.string(),
  description: z.string().optional(),
  bought: z.boolean().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
});

export default resolver.pipe(resolver.zod(CreateItem), resolver.authorize(), async (input, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const item = await db.item.create({
    data: {
      ...input,
      owner: { connect: { id: ctx.session.userId } },
    },
  });

  return item;
});
