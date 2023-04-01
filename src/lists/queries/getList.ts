import { NotFoundError } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Item, List } from "db";
import { z } from "zod";

const GetList = z.object({
  id: z.number().optional(),
  accessToken: z.string().optional(),
  includeOwner: z.boolean().optional(),
});

export default resolver.pipe(resolver.zod(GetList), async ({ id, accessToken, includeOwner }) => {
  if (accessToken) {
    return await db.list.findFirstOrThrow({
      where: { accessToken },
      include: {
        items: {
          include: {
            reservedBy: true,
          },
        },
        owner: Boolean(includeOwner),
      },
    });
  }

  try {
    return await db.list.findFirstOrThrow({
      where: { id },
      include: {
        items: {
          include: {
            reservedBy: true,
          },
        },
        owner: Boolean(includeOwner),
      },
    });
  } catch (e) {
    throw new NotFoundError();
  }
});
