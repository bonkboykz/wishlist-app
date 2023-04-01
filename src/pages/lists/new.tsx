import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "src/core/layouts/Layout";
import createList from "src/lists/mutations/createList";
import { ListForm, FORM_ERROR } from "src/lists/components/ListForm";

const NewListPage = () => {
  const router = useRouter();
  const [createListMutation] = useMutation(createList);

  return (
    <Layout title={"Create New List"}>
      <h1>Create New List</h1>

      <ListForm
        submitText="Create List"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateList}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const list = await createListMutation(values);
            await router.push(Routes.ShowListPage({ listId: list.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.ListsPage()}>Lists</Link>
      </p>
    </Layout>
  );
};

NewListPage.authenticate = true;

export default NewListPage;
