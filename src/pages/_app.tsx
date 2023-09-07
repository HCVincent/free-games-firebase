import Layout from "@/components/Layout/Layout";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { RecoilRoot, RecoilEnv } from "recoil";
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = React.useState("dark");
  return (
    <RecoilRoot>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  );
}
export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=30, stale-while-revalidate=59"
  );

  return {
    props: {},
  };
}
