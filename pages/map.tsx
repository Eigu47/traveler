import MapCanvas from "../components/map/MapCanvas";
import Results from "../components/map/Results";
import { HiMenu } from "react-icons/hi";
import { useState } from "react";

export default function Map({ isLoaded }: { isLoaded: boolean }) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  return (
    <>
      <nav>
        <button
          className="fixed right-2 top-2 z-20 rounded-full bg-blue-700 p-3 text-slate-300 sm:hidden"
          onClick={() => setIsHamburgerOpen(true)}
        >
          <HiMenu className="text-4xl" />
        </button>
      </nav>
      <main className="relative flex h-full max-w-full flex-row sm:top-14 sm:h-[calc(100%-56px)] md:h-[calc(100%-56px)]">
        <Results />
        <MapCanvas isLoaded={isLoaded} />
      </main>
    </>
  );
}
