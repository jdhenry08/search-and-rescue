import Head from "next/head";

import { Inter } from "next/font/google";

import { type AppPropsWithLayout } from "~/utils/types";

import "~/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <>
      <style global jsx>
        {`
          body {
            --font-sans: ${inter.style.fontFamily};
          }
        `}
      </style>

      <Head>
        <title>Search & Rescue</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen">
        <Component.Layout>
          <Component {...pageProps} />
        </Component.Layout>
      </main>
    </>
  );
}
