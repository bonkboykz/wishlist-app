import Head from "next/head";
import React, { FC } from "react";
import { BlitzLayout, Routes } from "@blitzjs/next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

const BaseLayout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
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

      <main className="p-2">{children}</main>
    </>
  );
};

export default BaseLayout;
