import { type AppType } from "next/app";

import { Inter } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { cn } from "~/utils/helpers";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Search & Rescue</title>
      </Head>

      <main className={cn("min-h-screen font-sans", inter.variable)}>
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default api.withTRPC(MyApp);
