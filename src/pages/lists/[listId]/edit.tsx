import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import getList from "src/lists/queries/getList";
import updateList from "src/lists/mutations/updateList";
import { ListForm, FORM_ERROR } from "src/lists/components/ListForm";

export const EditList = () => {
  const router = useRouter();
  const listId = useParam("listId", "number");
  const [list, { setQueryData }] = useQuery(
    getList,
    { id: listId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateListMutation] = useMutation(updateList);

  return (
    <>
      <Head>
        <title>Edit List {list.id}</title>
      </Head>

      <div>
        <h1>Edit List {list.id}</h1>
        {/* <pre>{JSON.stringify(list, null, 2)}</pre> */}

        <ListForm
          submitText="Update List"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateList}
          initialValues={list}
          onSubmit={async (values) => {
            try {
              const updated = await updateListMutation({
                id: list.id,
                ...values,
              });
              await setQueryData(updated);
              await router.push(Routes.ShowListPage({ listId: updated.id }));
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

const EditListPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditList />
      </Suspense>

      <p>
        <Link href={Routes.ListsPage()}>Lists</Link>
      </p>
    </div>
  );
};

EditListPage.authenticate = true;
EditListPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditListPage;
