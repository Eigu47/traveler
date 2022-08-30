import { GoogleMap } from "@react-google-maps/api/";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { MdGpsFixed } from "react-icons/md";
import { useRouter } from "next/router";
import SearchBar from "./MapCanvasSearchBar";
import Image from "next/image";
import { NearbySearchResult, Result } from "../../types/NearbySearchResult";
import { useAtom } from "jotai";
import {
  allResultsAtom,
  clickedPlaceAtom,
  favoritesIdAtom,
  queryLatLngAtom,
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
import MapCanvasMarker from "./MapCanvasMarker";
import MapCanvasPlaceCard from "./MapCanvasPlaceCard";
import MapCanvasSearchMenu from "./MapCanvasSearchMenu";
import { getFavorites } from "./ResultsUtil";

interface Props {
  isLoaded: boolean;
}

export default function MapCanvas({ isLoaded }: Props) {
  const router = useRouter();
  const mapRef = useRef<google.maps.Map>();
  const [centerMenu, setCenterMenu] = useState<google.maps.LatLngLiteral>();
  const [loadFinish, setLoadFinish] = useState(false);
  const [allResults] = useAtom(allResultsAtom);
  const [queryLatLng, setQueryLatLng] = useAtom(queryLatLngAtom);
  const [selectedPlace, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const [, setClickedPlace] = useAtom(clickedPlaceAtom);
  const [showResults] = useAtom(showResultsAtom);
  const [favoritesId, setFavoritesId] = useAtom(favoritesIdAtom);
  const { handleMouseDown, handleMouseUp, clearOverlay } = useMapCanvasUtil(
    setCenterMenu,
    setSelectedPlace
  );
  const { data: session } = useSession();

  const userId = (session?.user as { _id: string | null })?._id;

  function handleClickMarker(places: Result) {
    if (allResults.some((result) => result.place_id === places.place_id))
      return;

    allResults.unshift(places);
  }

  const { isSuccess } = useInfiniteQuery<NearbySearchResult>(
    ["nearby", queryLatLng],
    {
      enabled: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  const { data: favoritesData, isSuccess: favoritesIsSuccess } = useQuery(
    ["favorites", userId],
    () => getFavorites(userId),
    {
      enabled: !!session,
      onSuccess: (data) =>
        setFavoritesId(data.favorites?.flatMap((fav) => fav.place_id)),
    }
  );

  useEffect(() => {
    if (
      router.query.lat &&
      router.query.lng &&
      !isNaN(+router.query.lat) &&
      !isNaN(+router.query.lng)
    )
      setQueryLatLng({ lat: +router.query.lat, lng: +router.query.lng });
  }, [router.query, setQueryLatLng]);

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
              allResults
                .filter((result) => !favoritesId?.includes(result.place_id))
                .map((place) => (
                  <MapCanvasMarker
                    key={place.place_id}
                    places={place}
                    setClickedPlace={setClickedPlace}
                    setSelectedPlace={setSelectedPlace}
                    isFavorited={false}
                  />
                ))}
            {favoritesIsSuccess &&
              favoritesData.favorites?.map((place) => (
                <MapCanvasMarker
                  key={place.place_id}
                  places={place}
                  setClickedPlace={setClickedPlace}
                  setSelectedPlace={setSelectedPlace}
                  isFavorited={true}
                  handleClickMarker={handleClickMarker}
                />
              ))}
            {selectedPlace && (
              <MapCanvasPlaceCard
                selectedPlace={selectedPlace}
                isFavorited={!!favoritesId?.includes(selectedPlace.place_id)}
              />
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
