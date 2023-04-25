import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "src/core/layouts/Layout";
import getShops from "src/shops/queries/getShops";

const ITEMS_PER_PAGE = 100;

export const ShopsList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ shops, hasMore }] = usePaginatedQuery(getShops, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {shops.map((shop) => (
          <li key={shop.id} className="my-2 shadow rounded-md p-4">
            <div>
              <h4 className="text-xl">{shop.title}</h4>

              <p className="my-2">{shop.description}</p>
            </div>

            <Link href={Routes.ShowShopPage({ shopId: shop.id })}>Show</Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  );
};

const ShopsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Shops</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewShopPage()} className="btn">
            Create Shop
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ShopsList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default ShopsPage;
