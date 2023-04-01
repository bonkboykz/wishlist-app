import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateList = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  public: z.boolean().optional(),
});

export default resolver.pipe(
  resolver.zod(UpdateList),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const list = await db.list.update({
      where: { id },
      data,
      include: { items: { include: { reservedBy: true } }, owner: true },
    });

    return list;
  }
);
