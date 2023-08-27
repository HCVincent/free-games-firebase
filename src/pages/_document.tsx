import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

// https://xahidex.com/blog/nextjs-adsense
export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}`}
          async={true}
          crossOrigin="anonymous"
        />
      </body>
    </Html>
  );
}
