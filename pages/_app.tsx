import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useLoadScript } from "@react-google-maps/api";
import { Provider } from "jotai";

export default function MyApp({ Component, pageProps }: AppProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY as string,
    libraries,
  });

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
      <QueryClientProvider client={queryClient}>
        <Provider>
          <Navbar />
          <Component {...pageProps} isLoaded={isLoaded} />
          {/* <ReactQueryDevtools /> */}
        </Provider>
      </QueryClientProvider>
    </>
  );
}

const queryClient = new QueryClient();

const libraries: (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[] = ["places"];
