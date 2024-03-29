import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import getItem from "src/items/queries/getItem";
import updateItem from "src/items/mutations/updateItem";
import { ItemForm, FORM_ERROR } from "src/items/components/ItemForm";

export const EditItem = () => {
  const router = useRouter();
  const itemId = useParam("itemId", "number");
  const [item, { setQueryData }] = useQuery(
    getItem,
    { id: itemId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateItemMutation] = useMutation(updateItem);

  return (
    <>
      <Head>
        <title>Edit Item {item.id}</title>
      </Head>

      <div>
        <h1>Edit Item {item.id}</h1>
        <ItemForm
          submitText="Update Item"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateItem}
          initialValues={item}
          onSubmit={async (values) => {
            if (Number.isNaN(values.price) || !values.price) {
              delete values.price;
            }

            if (!values.description) {
              delete values.description;
            }

            if (!values.currency) {
              delete values.currency;
            }

            try {
              const updated = await updateItemMutation({
                id: item.id,
                ...values,
              });
              await setQueryData(updated);
              await router.push(Routes.ShowItemPage({ itemId: updated.id }));
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

const EditItemPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditItem />
      </Suspense>

      <p>
        <Link href={Routes.ItemsPage()}>Items</Link>
      </p>
    </div>
  );
};

EditItemPage.authenticate = true;
EditItemPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditItemPage;
