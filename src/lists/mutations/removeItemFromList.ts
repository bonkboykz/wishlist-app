import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const RemoveItemFromList = z.object({
  id: z.number(),
  itemId: z.number(),
});

export default resolver.pipe(
  resolver.zod(RemoveItemFromList),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const list = await db.list.update({
      where: { id },
      data: {
        items: {
          disconnect: {
            id: data.itemId,
          },
        },
      },
    });

    return list;
  }
);
