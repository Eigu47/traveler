import MapCanvas from "../components/map/MapCanvas";
import Results from "../components/map/Results";
import { useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

const libraries: (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[] = ["places"];

export default function Map() {
  const [radius, setRadius] = useState<number>(5000);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY as string,
    libraries,
  });

  return (
    <main className="relative top-12 flex h-[calc(100vh-48px)] max-h-full max-w-full">
      <Results radius={radius} setRadius={setRadius} />
      <MapCanvas radius={radius} isLoaded={isLoaded} />
    </main>
  );
}
