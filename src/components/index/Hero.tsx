import Image from "next/image";
import Link from "next/link";
import { FiMap, FiSearch } from "react-icons/fi";

import HeroSearchBar from "@/components/index/HeroSearchBar";

interface Props {
  googleMapScriptIsLoaded: boolean;
}

export default function Hero({ googleMapScriptIsLoaded }: Props) {
  return (
    <section className="hero-clip h-full">
      <div className="fixed -z-10 h-full w-screen max-w-full">
        <Image
          src="/hero-bg.jpg"
          alt="Ocean background"
          objectFit="cover"
          layout="fill"
          priority
        />
      </div>
      <div className="absolute top-[20vh] flex w-screen max-w-full flex-col items-center md:top-[35vh]">
        <h1 className="text-center font-serif text-5xl font-semibold text-white">
          Discover new places
        </h1>
        {googleMapScriptIsLoaded && <HeroSearchBar />}
        {!googleMapScriptIsLoaded && (
          <div className="m-16 flex w-10/12 items-center overflow-hidden rounded-full bg-slate-200 p-2 pl-4 text-2xl shadow-lg ring-1 ring-black/30 md:w-6/12">
            <p className="w-full text-slate-500">Loading...</p>
            <button
              className="rounded-full bg-slate-500 p-2 text-2xl text-slate-300 shadow-md ring-1 ring-black/30"
              disabled
            >
              <FiSearch />
            </button>
          </div>
        )}
        <Link href="/map">
          <button className="m-6 flex items-center rounded-full bg-blue-600 p-5 text-lg text-white shadow-lg ring-1 ring-black/30 duration-75 ease-in-out hover:scale-[102%] active:scale-[98%]">
            Show Map
            <FiMap className="ml-3 text-2xl" />
          </button>
        </Link>
      </div>
    </section>
  );
}
