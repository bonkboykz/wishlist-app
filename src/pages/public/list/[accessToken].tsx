import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import getList from "src/lists/queries/getList";
import reserveItem from "src/items/mutations/reserveItem";
import freeItem from "src/items/mutations/freeItem";
import { useCurrentUser } from "src/users/hooks/useCurrentUser";
import { toast } from "react-hot-toast";
import getShops from "src/shops/queries/getShops";
import getLastCurrencyHistory from "src/currency-histories/queries/getLastCurrencyHistory";

export const List = () => {
  const listAccessToken = useParam("accessToken", "string");
  const [list, { refetch }] = useQuery(getList, {
    accessToken: listAccessToken,
    includeOwner: true,
  });
  const [reserveItemMutation] = useMutation(reserveItem);
  const [freeItemMutation] = useMutation(freeItem);

  const [{ shops: ownerShops }] = useQuery(getShops, {
    where: { ownerId: list.ownerId, public: true },
  });

  const user = useCurrentUser();

  const { currency = "KZT" } = useRouter().query;

  const targetCurrenty = Array.isArray(currency) ? currency.join("") : currency;

  const [usdConversionRate] = useQuery(getLastCurrencyHistory, { from: "USD", to: targetCurrenty });
  const [rubConversionRate] = useQuery(getLastCurrencyHistory, { from: "RUB", to: targetCurrenty });

  console.log(usdConversionRate);

  return (
    <>
      <Head>
        <title>List of {list.owner.email}</title>
      </Head>

      <div>
        <h1 className="text-2xl">List of {list.owner.email}</h1>

        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {list.items.map((item) => (
            <li key={item.id}>
              <div className="card card-compact bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className={`card-title ${item.bought ? "line-through" : ""}`}>
                    {item.title}
                  </h2>
                  {item.bought && <p className="text-red-400">Bought</p>}
                  <p>{item.description}</p>
                  <p className="text-green-400">
                    {item.price} {item.currency}
                  </p>
                  {item.currency === "USD" && (
                    <p className="text-gray-400">
                      {((usdConversionRate?.rate ?? 1) * (item.price ?? 0)).toFixed(2)} KZT
                    </p>
                  )}
                  {item.currency === "RUB" && (
                    <p className="text-gray-400">
                      {((rubConversionRate?.rate ?? 1) * (item.price ?? 0)).toFixed(2)} KZT
                    </p>
                  )}
                  <p>
                    {item.reserved
                      ? `Reserved by ${item.reservedBy?.email ?? "Anonymous"}`
                      : `Not reserved`}
                  </p>

                  <div className="card-actions justify-end">
                    {!item.reserved ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={async () => {
                          await reserveItemMutation({ id: item.id, userId: user?.id });

                          await refetch();

                          toast.success("Item reserved");
                        }}
                      >
                        Reserve
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={async () => {
                          await freeItemMutation({ id: item.id, userId: user?.id });

                          await refetch();

                          toast.success("Item freed");
                        }}
                      >
                        Free
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="text-xl mt-4">Favourite shops</h2>
        <h3 className="text-lg my-2">
          This user likes these shops. You could find something else in there
        </h3>

        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {ownerShops.map((shop) => (
            <li key={shop.id}>
              <div className="card card-compact bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">{shop.title}</h2>
                  <p>{shop.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const ShowPublicListPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <List />
      </Suspense>
    </div>
  );
};

ShowPublicListPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowPublicListPage;
