import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import getList from "src/lists/queries/getList";
import deleteList from "src/lists/mutations/deleteList";
import getItems from "src/items/queries/getItems";
import addItemToList from "src/lists/mutations/addItemToList";
import removeItemFromList from "src/lists/mutations/removeItemFromList";
import { toast } from "react-hot-toast";

export const List = () => {
  const router = useRouter();
  const listId = useParam("listId", "number");
  const [deleteListMutation] = useMutation(deleteList);
  const [list, { refetch }] = useQuery(getList, { id: listId });
  const [{ items: notInListItems }] = useQuery(getItems, {
    where: {
      NOT: {
        id: {
          in: list.items.map((item) => item.id),
        },
      },
    },
  });

  const [addToListMutation] = useMutation(addItemToList);
  const [removeFromListMutation] = useMutation(removeItemFromList);

  return (
    <>
      <Head>
        <title>List {list.title}</title>
      </Head>

      <div className="flex gap-4 flex-col">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl">List {list.title}</h1>
            <p className="">{list.description}</p>
            <p className="">This is {list.public ? "public" : "private"} list</p>
          </div>
          <div className="flex flex-row gap-2">
            {list.public && (
              <button
                className="btn btn-primary"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `${window.location.origin}/public/list/${list.accessToken}`
                  );

                  toast.success("Copied to clipboard");
                }}
              >
                Copy Public Url
              </button>
            )}

            <Link href={Routes.EditListPage({ listId: list.id })} className="btn btn-ghost">
              Edit
            </Link>
            <button
              className="btn btn-error"
              type="button"
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deleteListMutation({ id: list.id });
                  await router.push(Routes.ListsPage());
                }
              }}
              style={{ marginLeft: "0.5rem" }}
            >
              Delete
            </button>
          </div>
        </div>

        <h2 className="text-lg">Items in this list</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.items.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={async () => {
                        await removeFromListMutation({ id: list.id, itemId: item.id });
                        await refetch();

                        toast.success("Item removed from list");
                      }}
                    >
                      Remove from this list
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h2 className="text-lg">Items NOT in this list</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notInListItems.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={async () => {
                        await addToListMutation({ id: list.id, itemId: item.id });

                        await refetch();

                        toast.success("Item added to list");
                      }}
                    >
                      Add to this list
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const ShowListPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <List />
    </Suspense>
  );
};

ShowListPage.authenticate = true;
ShowListPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowListPage;
