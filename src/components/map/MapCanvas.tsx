import { GoogleMap } from "@react-google-maps/api/";
<<<<<<< HEAD
import { useRef, useState } from "react";
=======
import { useCallback, useRef, useState, useEffect } from "react";
>>>>>>> 791dae1ab2780ca51afd303d552049f6194e495b
import { useAtom } from "jotai";
import SearchBar from "./MapCanvasSearchBar";
import {
  DEFAULT_CENTER,
<<<<<<< HEAD
  handleMouseDown,
  handleMouseUp,
  handleRightClickOnMap,
  useGetIsShowFavorites,
  useGetQueryLatLng,
=======
  getCurrentPosition,
  handleMouseDown,
  handleMouseUp,
  handleRightClickOnMap,
  useGetParams,
>>>>>>> 791dae1ab2780ca51afd303d552049f6194e495b
} from "./MapCanvasUtil";
import MapCanvasCenter from "./MapCanvasCenter";
import MapCanvasMarker from "./MapCanvasMarker";
import MapCanvasPlaceCard from "./MapCanvasPlaceCard";
<<<<<<< HEAD
import MapCanvasSearchMenu from "./MapCanvasSearchButton";
import { useGetFavorites, useGetFavoritesId } from "@/utils/useQueryFavorites";
import { useGetFlatResults } from "@/utils/useQueryResults";
import { favoritesListAtom, mapRefAtom, searchButtonAtom } from "@/utils/store";
import MapCanvasGpsButton from "./MapCanvasGpsButton";
import MapCanvasSynchronize from "./MapCanvasSynchronize";
=======
import MapCanvasSearchButton from "./MapCanvasSearchButton";
import { useGetFavorites, useGetFavoritesId } from "@/utils/useQueryFavorites";
import { useGetFlatResults } from "@/utils/useQueryResults";
import { useRouter } from "next/router";
import {
  clickedPlaceAtom,
  favoritesListAtom,
  mapRefAtom,
  selectedPlaceAtom,
  showResultsAtom,
  showSearchOptionsAtom,
} from "@/utils/store";
>>>>>>> 791dae1ab2780ca51afd303d552049f6194e495b

interface Props {}

export default function MapCanvas({}: Props) {
  const [, setSearchButton] = useAtom(searchButtonAtom);
  const [favoritesList] = useAtom(favoritesListAtom);
  const [, setMapRef] = useAtom(mapRefAtom);
  const timerRef = useRef<NodeJS.Timeout>();
  const [currentPosition, setCurrentPosition] =
    useState<google.maps.LatLngLiteral>();

<<<<<<< HEAD
  const queryLatLng = useGetQueryLatLng();
  const isShowFavorites = useGetIsShowFavorites();
  const { data: favoritesData, isSuccess: favoritesIsSuccess } =
    useGetFavorites();
  const favoritesId = useGetFavoritesId();
  const flatResults = useGetFlatResults();

  return (
    <MapCanvasSynchronize
      setCurrentPosition={setCurrentPosition}
      timerRef={timerRef}
    >
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
            setSearchButton(undefined);
          }}
          onZoomChanged={() => {
            handleMouseUp(timerRef);
            setSearchButton(undefined);
          }}
        >
          <MapCanvasCenter />
          {flatResults
            .concat(favoritesList)
            .filter((result) => !favoritesId?.includes(result.place_id))
            .map((place) => (
              <MapCanvasMarker
                key={place.place_id}
                places={place}
                isFavorited={false}
              />
            ))}
          {(isShowFavorites || favoritesIsSuccess) &&
            favoritesData?.map((place) => (
              <MapCanvasMarker
                key={place.place_id}
                places={place}
                isFavorited={true}
              />
            ))}
          <MapCanvasPlaceCard />
          <MapCanvasSearchMenu />
        </GoogleMap>
        <SearchBar />
        <MapCanvasGpsButton />
      </section>
    </MapCanvasSynchronize>
=======
  const { queryLatLng, showFavorites } = useGetParams();

  const flatResults = useGetFlatResults();

  const { data: favoritesData, isSuccess: favoritesIsSuccess } =
    useGetFavorites();

  const favoritesId = useGetFavoritesId();

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
          favoritesData?.map((place) => (
            <MapCanvasMarker
              key={place.place_id}
              places={place}
              setClickedPlace={setClickedPlace}
              setSelectedPlace={setSelectedPlace}
              isFavorited={true}
            />
          ))}
        {selectedPlace && (
          <MapCanvasPlaceCard
            selectedPlace={selectedPlace}
            isFavorited={!!favoritesId?.includes(selectedPlace.place_id)}
          />
        )}
        {searchButton && (
          <MapCanvasSearchButton
            searchButton={searchButton}
            setSearchButton={setSearchButton}
          />
        )}
      </GoogleMap>
      <SearchBar />
      <button
        onClick={() => getCurrentPosition(router)}
        className={`fixed right-4 rounded-lg bg-white p-1 text-4xl text-gray-600 shadow-md ring-1 ring-black/20 duration-300 hover:text-black sm:bottom-6 md:transition-none ${
          showResults ? "bottom-72" : "bottom-12"
        }`}
      >
        <MdGpsFixed />
      </button>
    </section>
>>>>>>> 791dae1ab2780ca51afd303d552049f6194e495b
  );
}
