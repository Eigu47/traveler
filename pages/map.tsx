import MapCanvas from "../components/map/MapCanvas";
import Results from "../components/map/Results";
import { useLoadScript } from "@react-google-maps/api";
import Loading from "../components/map/Loading";

const libraries: (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[] = ["places"];

export default function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY as string,
    libraries,
  });

  // const isLoaded = false;

  return (
    <main className="relative top-12 flex h-[calc(100vh-48px)] max-h-full max-w-full">
      <Results />
      {isLoaded ? <MapCanvas /> : <Loading />}
    </main>
  );
}
