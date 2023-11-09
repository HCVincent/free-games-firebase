import Layout from "@/components/Layout/Layout";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { RecoilRoot, RecoilEnv } from "recoil";
import Head from "next/head";
import { ToastProvider } from "@/providers/toaster-provider";
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <title>FreeVRGames</title>

        <meta
          name="description"
          content="You can download kinds of type of VR games for free"
        />
      </Head>
      <RecoilRoot>
        <div className="min-w-[450px]">
          <Layout>
            <ToastProvider />
            <Component {...pageProps} />
          </Layout>
        </div>
      </RecoilRoot>
    </>
  );
}
