import { Suspense } from "react";
import { BlitzPage, Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import getItem from "src/items/queries/getItem";
import deleteItem from "src/items/mutations/deleteItem";

export const Item = () => {
  const router = useRouter();
  const itemId = useParam("itemId", "number");
  const [deleteItemMutation] = useMutation(deleteItem);
  const [item] = useQuery(getItem, { id: itemId });

  return (
    <>
      <Head>
        <title>Item {item.title}</title>
      </Head>

      <div>
        <div className="flex gap-4 flex-col">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-xl">{item.title}</h1>
              <p className="">{item.description}</p>
            </div>
            <div className="flex flex-row gap-2">
              <Link href={Routes.EditItemPage({ itemId: item.id })} className="btn btn-ghost">
                Edit
              </Link>
              <button
                className="btn btn-error"
                type="button"
                onClick={async () => {
                  if (window.confirm("This will be deleted")) {
                    await deleteItemMutation({ id: item.id });
                    await router.push(Routes.ListsPage());
                  }
                }}
                style={{ marginLeft: "0.5rem" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ShowItemPage: BlitzPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Item />
    </Suspense>
  );
};

ShowItemPage.authenticate = {
  redirectTo: Routes.LoginPage(),
};
ShowItemPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowItemPage;
