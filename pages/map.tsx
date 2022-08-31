import MapCanvas from "../components/map/MapCanvas";
import Results from "../components/map/Results";
import { HiMenu, HiX } from "react-icons/hi";
import { useAtom } from "jotai";
import { showHamburgerAtom, showSearchOptionsAtom } from "../utils/store";

export default function Map({ isLoaded }: { isLoaded: boolean }) {
  const [showHamburger, setShowHamburger] = useAtom(showHamburgerAtom);
  const [, setShowSearchOptions] = useAtom(showSearchOptionsAtom);

  return (
    <>
      <nav>
        <button
          className={`fixed right-2 top-2 z-20 rounded-full p-3 text-slate-100 duration-100 sm:hidden ${
            showHamburger ? "bg-transparent" : "bg-blue-700"
          }`}
          onClick={() => {
            if (!showHamburger) setShowSearchOptions(false);
            setShowHamburger((prev) => !prev);
          }}
        >
          <HiMenu
            className={`absolute text-4xl duration-300 ${
              showHamburger
                ? "-rotate-180 scale-0 opacity-0"
                : "rotate-180 scale-100 opacity-100"
            }`}
          />
          <HiX
            className={`text-4xl duration-300 ${
              showHamburger
                ? "-rotate-180 scale-100 opacity-100"
                : "rotate-180 scale-0 opacity-0"
            }`}
          />
        </button>
      </nav>
      <main className="relative flex h-full max-w-full flex-row sm:top-14 sm:h-[calc(100%-56px)] md:h-[calc(100%-56px)]">
        <Results />
        <MapCanvas isLoaded={isLoaded} />
      </main>
    </>
  );
}
