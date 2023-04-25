import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "src/core/layouts/Layout";
import createShop from "src/shops/mutations/createShop";
import { ShopForm, FORM_ERROR } from "src/shops/components/ShopForm";

const NewShopPage = () => {
  const router = useRouter();
  const [createShopMutation] = useMutation(createShop);

  return (
    <Layout title={"Create New Shop"}>
      <h1>Create New Shop</h1>

      <ShopForm
        submitText="Create Shop"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateShop}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const shop = await createShopMutation(values);
            await router.push(Routes.ShopsPage());
            // await router.push(Routes.ShowShopPage({ shopId: shop.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.ShopsPage()}>Shops</Link>
      </p>
    </Layout>
  );
};

NewShopPage.authenticate = true;

export default NewShopPage;
