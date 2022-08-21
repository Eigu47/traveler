import { useState } from "react";
import MapCanvas from "../components/map/MapCanvas";
import Results from "../components/map/Results";
import { Result } from "../types/NearbySearchResult";

export default function Map({ isLoaded }: { isLoaded: boolean }) {
  const [radius, setRadius] = useState<number>(5000);
  const [selectedPlace, setSelectedPlace] = useState<Result>();
  const [clickedPlace, setClickedPlace] = useState<string>();
  const [searchbarOnFocus, setSearchbarOnFocus] = useState(false);

  return (
    <main className="relative z-20 flex h-full max-w-full flex-col-reverse sm:top-14 sm:z-0 sm:h-[calc(100%-56px)] md:h-[calc(100%-56px)] md:flex-row">
      <Results
        radius={radius}
        setRadius={setRadius}
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
        clickedPlace={clickedPlace}
        searchbarOnFocus={searchbarOnFocus}
      />
      <MapCanvas
        radius={radius}
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
        setClickedPlace={setClickedPlace}
        isLoaded={isLoaded}
        searchbarOnFocus={searchbarOnFocus}
        setSearchbarOnFocus={setSearchbarOnFocus}
      />
    </main>
  );
}
