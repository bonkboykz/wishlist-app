import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import getShop from "src/shops/queries/getShop";
import updateShop from "src/shops/mutations/updateShop";
import { ShopForm, FORM_ERROR } from "src/shops/components/ShopForm";

export const EditShop = () => {
  const router = useRouter();
  const shopId = useParam("shopId", "number");
  const [shop, { setQueryData }] = useQuery(
    getShop,
    { id: shopId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateShopMutation] = useMutation(updateShop);

  return (
    <>
      <Head>
        <title>Edit Shop {shop.id}</title>
      </Head>

      <div>
        <h1>Edit Shop {shop.id}</h1>

        <ShopForm
          submitText="Update Shop"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateShop}
          initialValues={shop}
          onSubmit={async (values) => {
            try {
              const updated = await updateShopMutation({
                id: shop.id,
                ...values,
              });
              await setQueryData(updated);
              await router.push(Routes.ShowShopPage({ shopId: updated.id }));
            } catch (error: any) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </div>
    </>
  );
};

const EditShopPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditShop />
      </Suspense>

      <p>
        <Link href={Routes.ShopsPage()}>Shops</Link>
      </p>
    </div>
  );
};

EditShopPage.authenticate = true;
EditShopPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditShopPage;
