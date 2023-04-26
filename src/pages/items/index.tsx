import { Suspense } from "react";
import { BlitzPage, Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "src/core/layouts/Layout";
import getItems from "src/items/queries/getItems";
import { useCurrentUser } from "src/users/hooks/useCurrentUser";

const ITEMS_PER_PAGE = 100;

export const ItemsList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const user = useCurrentUser();
  const [{ items, hasMore }] = usePaginatedQuery(getItems, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    where: {
      ownerId: user?.id,
    },
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <>
      <div>
        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <li key={item.id}>
              <div className="card card-compact bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className={`card-title ${item.bought ? "line-through" : ""}`}>
                    {item.title}
                  </h2>
                  <p>{item.description}</p>
                  <p className="text-green-400">
                    {item.price} {item.currency}
                  </p>

                  <div className="card-actions justify-end">
                    <Link href={Routes.ShowItemPage({ itemId: item.id })} className="btn btn-sm">
                      Show
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <button disabled={page === 0} onClick={goToPreviousPage} className="btn">
          Previous
        </button>
        <button disabled={!hasMore} onClick={goToNextPage} className="btn">
          Next
        </button>
      </div>
    </>
  );
};

const ItemsPage: BlitzPage = () => {
  return (
    <Layout>
      <Head>
        <title>Items</title>
      </Head>

      <div className="flex gap-4 flex-col">
        <Suspense fallback={<div>Loading...</div>}>
          <ItemsList />
        </Suspense>
      </div>
    </Layout>
  );
};

ItemsPage.authenticate = {
  redirectTo: Routes.LoginPage(),
};

export default ItemsPage;
