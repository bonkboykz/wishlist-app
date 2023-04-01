import { generateToken, hash256 } from "@blitzjs/auth";
import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateList = z.object({
  title: z.string().refine(Boolean, "Required"),
  description: z.string().optional(),
  public: z.boolean().optional(),
});

export default resolver.pipe(resolver.zod(CreateList), resolver.authorize(), async (input, ctx) => {
  const token = generateToken();
  const hashedToken = hash256(token);

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const list = await db.list.create({
    data: {
      ...input,
      accessToken: hashedToken,
      owner: { connect: { id: ctx.session.userId } },
    },
  });

  return list;
});
