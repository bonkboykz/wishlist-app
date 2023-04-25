import { BlitzPage, Routes } from "@blitzjs/next";
import { useQuery } from "@blitzjs/rpc";
import { Suspense } from "react";
import Layout from "src/core/layouts/Layout";
import getItems from "src/items/queries/getItems";
import { useCurrentUser } from "src/users/hooks/useCurrentUser";

const Reservations = () => {
  const user = useCurrentUser();
  const [{ items }] = useQuery(getItems, { where: { reservedById: user?.id } });

  return (
    <div>
      <h1>Reservations</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export const ReservationsPage: BlitzPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Reservations />
    </Suspense>
  );
};

ReservationsPage.authenticate = {
  redirectTo: Routes.LoginPage(),
};

ReservationsPage.getLayout = (page) => <Layout title="Reservations">{page}</Layout>;

export default ReservationsPage;
