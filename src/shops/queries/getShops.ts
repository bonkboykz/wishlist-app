import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetShopsInput
  extends Pick<Prisma.ShopFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(async ({ where, orderBy, skip = 0, take = 100 }: GetShopsInput) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const {
    items: shops,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip,
    take,
    count: () => db.shop.count({ where }),
    query: (paginateArgs) => db.shop.findMany({ ...paginateArgs, where, orderBy }),
  });

  return {
    shops,
    nextPage,
    hasMore,
    count,
  };
});
