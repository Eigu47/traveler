import MapCanvas from "../components/map/MapCanvas";
import Results from "../components/map/Results";
import { useState } from "react";
import { Result } from "../types/NearbySearchResult";

export default function Map({ isLoaded }: { isLoaded: boolean }) {
  const [radius, setRadius] = useState<number>(5000);
  const [selectedPlace, setSelectedPlace] = useState<Result>();
  const [clickedPlace, setClickedPlace] = useState<string>();

  return (
    <main className="relative top-14 flex h-[calc((var(--vh,1vh)*100)-56px)] max-h-full max-w-full flex-col-reverse sm:h-[calc(100vh-56px)] sm:flex-row">
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
