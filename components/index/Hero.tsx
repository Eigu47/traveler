import Image from "next/image";
import { FiMap } from "react-icons/fi";
import Link from "next/link";
import HeroSearchBar from "./HeroSearchBar";

export default function Hero({ isLoaded }: { isLoaded: boolean }) {
  return (
    <section>
      <div className="fixed -z-10 h-screen w-screen max-w-full">
        <Image
          src="/hero-bg.jpg"
          alt="Ocean background"
          objectFit="cover"
          layout="fill"
        ></Image>
      </div>
      <div className="absolute top-[35vh] flex w-screen max-w-full flex-col items-center">
        <h1 className="text-center font-serif text-5xl font-semibold text-white">
          The best travel experience
        </h1>
        {/* <form
          onSubmit={(e) => e.preventDefault()}
          className="m-16 flex w-6/12 justify-between rounded-full bg-white p-3 text-2xl shadow ring-1 ring-black/30"
        >
          <input
            type="text"
            placeholder="Search by city..."
            className="mx-3 grow outline-none"
          />
          <button className="rounded-full bg-indigo-600 p-2 text-2xl text-white shadow-md ring-1 ring-black/30 duration-75 ease-in-out hover:scale-105 active:scale-95">
            <FiSearch />
          </button>
        </form> */}
        {isLoaded && <HeroSearchBar />}
        <Link href="/map">
          <button className="m-6 flex items-center rounded-full bg-indigo-700 p-3 text-white shadow-lg ring-1 ring-black/30 duration-75 ease-in-out hover:scale-[102%] active:scale-[98%]">
            Show Map
            <FiMap className="ml-3 text-xl" />
          </button>
        </Link>
      </div>
    </section>
  );
}
