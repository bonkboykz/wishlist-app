import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const FreeItem = z.object({
  id: z.number(),
  userId: z.number().optional(),
});

export default resolver.pipe(resolver.zod(FreeItem), async ({ id, ...data }) => {
  const item = await db.item.findFirstOrThrow({ where: { id } });

  if (!data.userId) {
    return await db.item.update({
      where: { id },
      data: {
        reserved: false,
      },
    });
  }

  if (data.userId !== item.reservedById) {
    throw new Error("You are not the reservee of this item");
  }

  return await db.item.update({
    where: { id },
    data: {
      reserved: false,
      reservedBy: {
        disconnect: true,
      },
    },
  });
});
