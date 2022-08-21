import MapCanvas from "../components/map/MapCanvas";
import Results from "../components/map/Results";

export default function Map({ isLoaded }: { isLoaded: boolean }) {
  return (
    <main className="relative z-20 flex h-full max-w-full flex-col-reverse sm:top-14 sm:z-0 sm:h-[calc(100%-56px)] md:h-[calc(100%-56px)] md:flex-row">
      <Results />
      <MapCanvas isLoaded={isLoaded} />
    </main>
  );
}
