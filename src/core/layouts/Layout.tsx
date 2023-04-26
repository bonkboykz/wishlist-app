import Head from "next/head";
import React, { FC } from "react";
import { BlitzLayout, Routes } from "@blitzjs/next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { useCurrentUser } from "src/users/hooks/useCurrentUser";
import Image from "next/image";

const Layout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title || "wishlist-app"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster />

      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href={Routes.ListsPage()}>Lists</Link>
              </li>

              <li>
                <Link href={Routes.ItemsPage()}>Items</Link>
              </li>

              <li>
                <Link href={Routes.ListsPage()}>Reservations</Link>
              </li>
            </ul>
          </div>
          <div className="normal-case text-xl flex items-center gap-2">
            <Image src="/logo.svg" width={32} height={32} alt="Logo" />
            Wishlist <div className="badge badge-secondary">alpha</div>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href={Routes.ListsPage()}>Lists</Link>
            </li>

            <li>
              <Link href={Routes.ItemsPage()}>Items</Link>
            </li>

            <li>
              <Link href={Routes.ReservationsPage()}>Reservations</Link>
            </li>

            <li>
              <Link href={Routes.ShopsPage()}>Shops</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <Link href={Routes.NewItemPage()} className="btn btn-primary">
            New Item
          </Link>
        </div>
      </div>

      <main className="p-2">{children}</main>
    </>
  );
};

export default Layout;
