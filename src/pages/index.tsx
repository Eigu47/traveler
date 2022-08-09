import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

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
      <main>
        <div className="fixed -z-10 h-screen w-screen">
          <Image
            src="/hero-bg.jpg"
            alt="Ocean background"
            objectFit="cover"
            layout="fill"
          ></Image>
        </div>
      </main>
    </>
  );
};

export default Home;
