import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "src/core/layouts/Layout";
import getLists from "src/lists/queries/getLists";
import { useCurrentUser } from "src/users/hooks/useCurrentUser";

const ITEMS_PER_PAGE = 100;

export const ListsList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const user = useCurrentUser();
  const [{ lists, hasMore }] = usePaginatedQuery(getLists, {
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
          {lists.map((list) => (
            <li key={list.id}>
              <div className="card card-compact bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">{list.title}</h2>
                  <p>{list.description}</p>

                  <div className="card-actions justify-end">
                    <Link href={Routes.ShowListPage({ listId: list.id })} className="btn btn-sm">
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

const ListsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Lists</title>
      </Head>

      <div className="flex gap-4 flex-col">
        <p>
          <Link href={Routes.NewListPage()} className="btn">
            Create List
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ListsList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default ListsPage;
