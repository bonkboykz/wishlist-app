import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "src/core/layouts/Layout";
import createItem from "src/items/mutations/createItem";
import { ItemForm, FORM_ERROR } from "src/items/components/ItemForm";

const NewItemPage = () => {
  const router = useRouter();
  const [createItemMutation] = useMutation(createItem);

  return (
    <Layout title={"Create New Item"}>
      <h1>Create New Item</h1>

      <ItemForm
        submitText="Create Item"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateItem}
        // initialValues={{}}
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
            const item = await createItemMutation(values);
            await router.push(Routes.ShowItemPage({ itemId: item.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.ItemsPage()}>Items</Link>
      </p>
    </Layout>
  );
};

NewItemPage.authenticate = {
  redirectTo: Routes.LoginPage(),
};

export default NewItemPage;
