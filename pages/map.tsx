import MapCanvas from "../components/map/MapCanvas";
import Results from "../components/map/Results";
import { useState } from "react";
import { Result } from "../types/NearbySearchResult";

// interface SelectedPlace {
//   hover: Result | null;
//   clicked: Result | null;
// }

export default function Map() {
  const [radius, setRadius] = useState<number>(5000);
  const [selectedPlace, setSelectedPlace] = useState<Result>();
  // const [placeClicked, setPlaceClicked] = useState<Result>()

  return (
    <main className="relative top-14 flex h-[calc(100vh-56px)] max-h-full max-w-full">
      <Results
        radius={radius}
        setRadius={setRadius}
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
      />
      <MapCanvas
        radius={radius}
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
      />
    </main>
  );
}
