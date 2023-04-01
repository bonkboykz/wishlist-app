import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const ReserveItem = z.object({
  id: z.number(),
  userId: z.number().optional(),
});

export default resolver.pipe(resolver.zod(ReserveItem), async ({ id, ...data }) => {
  if (data.userId) {
    const item = await db.item.update({
      where: { id },
      data: {
        reserved: true,
        reservedBy: { connect: { id: data.userId } },
      },
    });
    return item;
  }

  const item = await db.item.update({
    where: { id },
    data: {
      reserved: true,
    },
  });

  return item;
});
