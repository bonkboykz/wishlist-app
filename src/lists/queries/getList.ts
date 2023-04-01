import { NotFoundError } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Item, List } from "db";
import { z } from "zod";

const GetList = z.object({
  id: z.number().optional(),
  accessToken: z.string().optional(),
});

export default resolver.pipe(resolver.zod(GetList), async ({ id, accessToken }) => {
  if (accessToken) {
    return await db.list.findFirstOrThrow({
      where: { accessToken },
      include: {
        items: {
          include: {
            reservedBy: true,
          },
        },
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
      },
    });
  } catch (e) {
    throw new NotFoundError();
  }
});
