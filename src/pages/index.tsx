import { Suspense } from "react";
import Link from "next/link";
import Layout from "src/core/layouts/Layout";
import { useCurrentUser } from "src/users/hooks/useCurrentUser";
import logout from "src/auth/mutations/logout";
import { useMutation } from "@blitzjs/rpc";
import { Routes, BlitzPage } from "@blitzjs/next";

const Home: BlitzPage = () => {
  return (
    <Layout title="Home">
      <div className="flex gap-4">
        <Link href={Routes.ListsPage()}>Your Lists</Link>
        <Link href={Routes.ItemsPage()}>Your Items</Link>
      </div>
    </Layout>
  );
};

Home.authenticate = {
  redirectTo: Routes.LoginPage(),
};

export default Home;
