import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRef } from "react";
import Navbar from "../components/navbar/Navbar";
import Head from "next/head";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useLoadScript } from "@react-google-maps/api";
import { Provider as JotaiProvider } from "jotai";
import { SessionProvider } from "next-auth/react";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY as string,
    libraries,
  });
  const queryClient = useRef(new QueryClient());

  return (
    <>
      <Head>
        <title>traveler</title>
        <meta
          name="description"
          content="Search and find your favorites places to visit"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient.current}>
          <Hydrate state={pageProps.dehydratedState}>
            <JotaiProvider>
              <Navbar />
              <Component {...pageProps} isLoaded={isLoaded} />
            </JotaiProvider>
          </Hydrate>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

const libraries: (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[] = ["places"];
