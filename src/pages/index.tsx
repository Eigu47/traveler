import type { NextPage } from "next";
import Head from "next/head";
import Hero from "../components/index/hero";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>TRAVELER</title>
        <meta
          name="description"
          content="Search and find your favorites places to visit"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
    </>
  );
};

export default Home;
