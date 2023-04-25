import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import getShop from "src/shops/queries/getShop";
import deleteShop from "src/shops/mutations/deleteShop";

export const Shop = () => {
  const router = useRouter();
  const shopId = useParam("shopId", "number");
  const [deleteShopMutation] = useMutation(deleteShop);
  const [shop] = useQuery(getShop, { id: shopId });

  return (
    <>
      <Head>
        <title>Shop {shop.title}</title>
      </Head>

      <div>
        <h1 className="text-xl">Shop {shop.title}</h1>
        <div className="my-2">
          <p>{shop.description}</p>

          <p>This shop is {shop.public ? "visible" : "invisible"} to others</p>
        </div>

        <Link href={Routes.EditShopPage({ shopId: shop.id })}>Edit</Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteShopMutation({ id: shop.id });
              await router.push(Routes.ShopsPage());
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

const ShowShopPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Shop />
    </Suspense>
  );
};

ShowShopPage.authenticate = true;
ShowShopPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowShopPage;
