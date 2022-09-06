import { GoogleMap } from "@react-google-maps/api/";
import { useCallback, useRef, useState, useMemo, useEffect } from "react";
import { useAtom } from "jotai";
import { MdGpsFixed } from "react-icons/md";
import SearchBar from "./MapCanvasSearchBar";
import {
  DEFAULT_CENTER,
  handleClickOnMarker,
  handleMouseDown,
  handleMouseUp,
  handleRightClickOnMap,
  handleSearchButton,
} from "./MapCanvasUtil";
import MapCanvasCenter from "./MapCanvasCenter";
import MapCanvasMarker from "./MapCanvasMarker";
import MapCanvasPlaceCard from "./MapCanvasPlaceCard";
import MapCanvasSearchMenu from "./MapCanvasSearchButton";
import { useGetFavorites } from "@/utils/useQueryFavorites";
import { useGetResults } from "@/utils/useQueryResults";
import { useRouter } from "next/router";
import {
  clickedPlaceAtom,
  favoritesListAtom,
  mapRefAtom,
  selectedPlaceAtom,
  showResultsAtom,
  showSearchOptionsAtom,
} from "@/utils/store";

interface Props {}

export default function MapCanvas({}: Props) {
  const router = useRouter();
  const [searchButton, setSearchButton] = useState<google.maps.LatLngLiteral>();
  const timerRef = useRef<NodeJS.Timeout>();
  const [selectedPlace, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const [favoritesList, setFavoritesList] = useAtom(favoritesListAtom);
  const [mapRef, setMapRef] = useAtom(mapRefAtom);
  const [, setClickedPlace] = useAtom(clickedPlaceAtom);
  const [showResults, setShowResults] = useAtom(showResultsAtom);
  const [, setShowSearchOptions] = useAtom(showSearchOptionsAtom);
  const [didMount, setDidMount] = useState(false);
  const [currentPosition, setCurrentPosition] =
    useState<google.maps.LatLngLiteral>();

  const queryLatLng: google.maps.LatLngLiteral | undefined = useMemo(() => {
    if (
      router.query.lat &&
      router.query.lng &&
      !isNaN(+router.query.lat) &&
      !isNaN(+router.query.lng)
    ) {
      return { lat: +router.query.lat, lng: +router.query.lng };
    }
  }, [router.query]);
  const showFavorites = !!router.query.favs;

  const { flatResults } = useGetResults(queryLatLng);
  const {
    response: { data: favoritesData, isSuccess: favoritesIsSuccess },
    favoritesId,
  } = useGetFavorites();

  const clearOverlay = useCallback(
    (e?: MouseEvent) => {
      if (!e) setSearchButton(undefined);

      if (e && timerRef.current) setSearchButton(undefined);

      if (
        (e?.target as HTMLElement)?.nodeName === "IMG" ||
        e
          ?.composedPath()
          .some((path) => (path as HTMLElement).nodeName === "ARTICLE")
      )
        return;

      setSelectedPlace(undefined);
    },

    [setSearchButton, setSelectedPlace]
  );

  useEffect(() => {
    window.addEventListener("click", clearOverlay);

    return () => window.removeEventListener("click", clearOverlay);
  }, [clearOverlay]);

  function getCurrentPosition() {
    navigator?.geolocation?.getCurrentPosition((pos) => {
      router.replace({
        pathname: "/map",
        query: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      });
    });
  }
  // Runs once when component mounts
  useEffect(() => {
    if (!didMount) {
      navigator?.geolocation?.getCurrentPosition((pos) => {
        setCurrentPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
      setShowResults(true);
      setClickedPlace(undefined);
      if (window?.innerWidth < 768) setShowSearchOptions(false);
      if (window?.innerWidth > 768) setShowSearchOptions(true);
      setDidMount(true);
      setFavoritesList([]);
    }
  }, [
    didMount,
    setFavoritesList,
    setShowResults,
    setShowSearchOptions,
    setClickedPlace,
  ]);
  // Runs every time url query changes
  useEffect(() => {
    if (!queryLatLng) return;
    mapRef?.panTo(queryLatLng);
    setClickedPlace(undefined);
    if (mapRef?.getZoom() ?? 12 < 12) mapRef?.setZoom(13);
    // Reset results
    setFavoritesList([]);
    setShowResults(true);
    // Close search options in mobile
    if (window?.innerWidth < 768) setShowSearchOptions(false);
  }, [
    queryLatLng,
    setShowResults,
    setShowSearchOptions,
    setClickedPlace,
    setFavoritesList,
    mapRef,
  ]);

  return (
    <section className="relative h-full w-full bg-[#e5e3df]">
      <GoogleMap
        zoom={queryLatLng ? 13 : 10}
        center={currentPosition ?? DEFAULT_CENTER}
        mapContainerClassName="h-full w-full"
        onLoad={(map) => setMapRef(map)}
        options={{
          mapId: "a73e177530bb64aa",
          disableDefaultUI: true,
          clickableIcons: false,
        }}
        onRightClick={(e) => handleRightClickOnMap(e, setSearchButton)}
        onMouseDown={(e) => handleMouseDown(e, timerRef, setSearchButton)}
        onMouseUp={() => handleMouseUp(timerRef)}
        onCenterChanged={() => {
          handleMouseUp(timerRef);
          clearOverlay();
        }}
        onZoomChanged={() => {
          handleMouseUp(timerRef);
          clearOverlay();
        }}
      >
        {queryLatLng && <MapCanvasCenter queryLatLng={queryLatLng} />}
        {flatResults
          .concat(favoritesList)
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
        {(showFavorites || favoritesIsSuccess) &&
          favoritesData?.favorites?.map((place) => (
            <MapCanvasMarker
              key={place.place_id}
              places={place}
              setClickedPlace={setClickedPlace}
              setSelectedPlace={setSelectedPlace}
              isFavorited={true}
              handleClickOnMarker={() =>
                handleClickOnMarker(place, flatResults, setFavoritesList)
              }
            />
          ))}
        {selectedPlace && (
          <MapCanvasPlaceCard
            selectedPlace={selectedPlace}
            isFavorited={!!favoritesId?.includes(selectedPlace.place_id)}
          />
        )}
        {searchButton && (
          <MapCanvasSearchMenu
            searchButton={searchButton}
            handleSearchButton={() =>
              handleSearchButton(searchButton, router, setSearchButton)
            }
          />
        )}
      </GoogleMap>
      <SearchBar />
      <button
        onClick={getCurrentPosition}
        className={`fixed right-4 rounded-lg bg-white p-1 text-4xl text-gray-600 shadow-md ring-1 ring-black/20 duration-300 hover:text-black sm:bottom-6 md:transition-none ${
          showResults ? "bottom-72" : "bottom-12"
        }`}
      >
        <MdGpsFixed />
      </button>
    </section>
  );
}
