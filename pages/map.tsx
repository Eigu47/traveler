import MapCanvas from "../components/map/MapCanvas";
import Results from "../components/map/Results";
import { useState } from "react";
import { Result } from "../types/NearbySearchResult";

export default function Map({ isLoaded }: { isLoaded: boolean }) {
  const [radius, setRadius] = useState<number>(5000);
  const [selectedPlace, setSelectedPlace] = useState<Result>();
  const [clickedPlace, setClickedPlace] = useState<string>();

  return (
    <main className="relative z-20 flex h-screen max-h-full max-w-full flex-col-reverse sm:top-14 sm:z-0 sm:h-[calc(100vh-56px)] sm:flex-row">
      <Results
        radius={radius}
        setRadius={setRadius}
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
        clickedPlace={clickedPlace}
      />
      <MapCanvas
        radius={radius}
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
        setClickedPlace={setClickedPlace}
        isLoaded={isLoaded}
      />
    </main>
  );
}
