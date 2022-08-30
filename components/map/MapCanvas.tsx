import { GoogleMap } from "@react-google-maps/api/";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdGpsFixed } from "react-icons/md";
import { useRouter } from "next/router";
import SearchBar from "./MapCanvasSearchBar";
import Image from "next/image";
import {
  FavoritesData,
  NearbySearchResult,
} from "../../types/NearbySearchResult";
import { useAtom } from "jotai";
import {
  clickedPlaceAtom,
  selectedPlaceAtom,
  showResultsAtom,
} from "../../utils/store";
import useMapCanvasUtil, {
  DEFAULT_CENTER,
  getCurrentPosition,
  handleRightClick,
} from "./mapCanvasUtil";
import { useSession } from "next-auth/react";
import MapCanvasCenter from "./MapCanvasCenter";
import MapCanvasResultMarker from "./MapCanvasResultMarker";
import MapCanvasFavorites from "./MapCanvasFavorites";
import MapCanvasPlaceCard from "./MapCanvasPlaceCard";
import MapCanvasSearchMenu from "./MapCanvasSearchMenu";

interface Props {
  isLoaded: boolean;
}

export default function MapCanvas({ isLoaded }: Props) {
  const router = useRouter();
  const mapRef = useRef<google.maps.Map>();
  const [centerMenu, setCenterMenu] = useState<google.maps.LatLngLiteral>();
  const [loadFinish, setLoadFinish] = useState(false);
  const [selectedPlace, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const [, setClickedPlace] = useAtom(clickedPlaceAtom);
  const [showResults] = useAtom(showResultsAtom);
  const { handleMouseDown, handleMouseUp, clearOverlay } = useMapCanvasUtil(
    setCenterMenu,
    setSelectedPlace
  );
  const { data: session } = useSession();

  const userId = (session?.user as { _id: string | null })?._id;

  const queryLatLng = useMemo(() => {
    if (
      router.query.lat &&
      router.query.lng &&
      !isNaN(+router.query.lat) &&
      !isNaN(+router.query.lng)
    )
      return { lat: +router.query.lat, lng: +router.query.lng };
  }, [router.query]);

  const { data, isSuccess } = useInfiniteQuery<NearbySearchResult>(
    ["nearby", queryLatLng],
    {
      enabled: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  const { data: favoritesData, isSuccess: favoritesIsSuccess } =
    useQuery<FavoritesData>(["favorites", userId]);

  const favoritesId = useMemo(() => {
    return favoritesData?.favorites?.flatMap((fav) => fav.place_id);
  }, [favoritesData]);

  useEffect(() => {
    if (queryLatLng) {
      mapRef.current?.panTo(queryLatLng);

      setClickedPlace(undefined);

      if (mapRef.current?.getZoom() ?? 12 < 12) mapRef.current?.setZoom(13);
    }
  }, [queryLatLng, setClickedPlace]);

  return (
    <section className="relative h-full w-full bg-[#e5e3df]">
      {!loadFinish && (
        <div className="flex h-full w-full items-center justify-center">
          <Image src="/loading.svg" alt="Loading..." height={200} width={200} />
        </div>
      )}
      {isLoaded && (
        <>
          <GoogleMap
            zoom={queryLatLng ? 13 : 10}
            center={queryLatLng ?? DEFAULT_CENTER}
            mapContainerClassName="h-full w-full"
            onLoad={(map) => {
              mapRef.current = map;
              setLoadFinish(true);
            }}
            options={{
              mapId: "a73e177530bb64aa",
              disableDefaultUI: true,
              clickableIcons: false,
            }}
            onRightClick={(e) => handleRightClick(e, setCenterMenu)}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onCenterChanged={() => {
              handleMouseUp();
              clearOverlay();
            }}
            onZoomChanged={() => {
              handleMouseUp();
              clearOverlay();
            }}
          >
            {queryLatLng && <MapCanvasCenter queryLatLng={queryLatLng} />}
            {isSuccess &&
              data.pages.map((page) =>
                page.results.map((places) => (
                  <MapCanvasResultMarker
                    key={places.place_id}
                    places={places}
                    setClickedPlace={setClickedPlace}
                    setSelectedPlace={setSelectedPlace}
                    favoritesId={favoritesId}
                  />
                ))
              )}
            {favoritesIsSuccess &&
              favoritesData.favorites?.map((fav) => (
                <MapCanvasFavorites
                  key={fav.place_id}
                  fav={fav}
                  setSelectedPlace={setSelectedPlace}
                />
              ))}
            {selectedPlace && (
              <MapCanvasPlaceCard selectedPlace={selectedPlace} />
            )}
            {centerMenu && (
              <MapCanvasSearchMenu
                centerMenu={centerMenu}
                router={router}
                setCenterMenu={setCenterMenu}
              />
            )}
          </GoogleMap>
          <SearchBar />
        </>
      )}
      <button
        onClick={() => getCurrentPosition(router)}
        className={`fixed right-4 rounded-lg bg-white p-1 text-4xl text-gray-600 shadow-md ring-1 ring-black/20 duration-300 hover:text-black sm:bottom-6 md:transition-none ${
          showResults ? "bottom-72" : "bottom-12"
        }`}
      >
        <MdGpsFixed />
      </button>
    </section>
  );
}
