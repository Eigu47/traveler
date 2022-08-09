import type { NextPage } from "next";
import Head from "next/head";

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
      <div className="text-3xl">HELLO WORLD</div>
    </>
  );
};

export default Home;
