import MapCanvas from "../components/map/MapCanvas";
import Results from "../components/map/Results";
import { useLoadScript } from "@react-google-maps/api";
import Loading from "../components/map/Loading";
import { useState } from "react";

const libraries: (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[] = ["places"];

export interface Boundary {
  tr_longitude: number;
  tr_latitude: number;
  bl_longitude: number;
  bl_latitude: number;
}

export default function Map() {
  const [boundary, setBoundary] = useState<Boundary>();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY as string,
    libraries,
  });

  // const isLoaded = false;

  return (
    <main className="relative top-12 flex h-[calc(100vh-48px)] max-h-full max-w-full">
      <Results />
      {isLoaded ? <MapCanvas setBoundary={setBoundary} /> : <Loading />}
    </main>
  );
}
