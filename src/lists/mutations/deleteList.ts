import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteList = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteList),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const list = await db.list.deleteMany({ where: { id } });

    return list;
  }
);
