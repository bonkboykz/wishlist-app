import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetCurrencyHistoriesInput
  extends Pick<
    Prisma.CurrencyHistoryFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({
    where,
    orderBy,
    skip = 0,
    take = 100,
  }: GetCurrencyHistoriesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: currencyHistories,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.currencyHistory.count({ where }),
      query: (paginateArgs) =>
        db.currencyHistory.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      currencyHistories,
      nextPage,
      hasMore,
      count,
    };
  }
);
