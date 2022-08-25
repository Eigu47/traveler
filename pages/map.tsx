import MapCanvas from "../components/map/MapCanvas";
import Results from "../components/map/Results";
import { HiMenu } from "react-icons/hi";

export default function Map({ isLoaded }: { isLoaded: boolean }) {
  return (
    <>
      <nav>
        <button className="fixed -right-10 -top-8 z-20 rounded-full bg-blue-700 p-4 pt-8 pr-10 text-slate-300 md:hidden">
          <HiMenu className="text-5xl" />
        </button>
      </nav>
      <main className="relative flex h-full max-w-full flex-col-reverse sm:top-14 sm:z-0 sm:h-[calc(100%-56px)] md:h-[calc(100%-56px)] md:flex-row">
        <Results />
        <MapCanvas isLoaded={isLoaded} />
      </main>
    </>
  );
}
