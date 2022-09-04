import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useState, useRef, useEffect, useCallback } from "react";
import { Result } from "../../types/NearbySearchResult";
import { useMemo } from "react";
import {
  clickedPlaceAtom,
  selectedPlaceAtom,
  showResultsAtom,
  showSearchOptionsAtom,
  favoritesListAtom,
} from "../../utils/store";
import { useGetFavorites, useGetResults } from "../../utils/useQueryHooks";

// Handles clicks and long taps in the map
export function useMapCanvas() {
  const router = useRouter();
  const [searchButton, setSearchButton] = useState<google.maps.LatLngLiteral>();
  const [selectedPlace, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const [favoritesList, setFavoritesList] = useAtom(favoritesListAtom);
  const timerRef = useRef<NodeJS.Timeout>();
  const mapRef = useRef<google.maps.Map>();
  const [, setClickedPlace] = useAtom(clickedPlaceAtom);
  const [showResults, setShowResults] = useAtom(showResultsAtom);
  const [, setShowSearchOptions] = useAtom(showSearchOptionsAtom);
  const [wasPrevFavorite, setWasPrevFavorite] = useState(false);
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
  const { response: favoriteRespose } = useGetFavorites();

  function handleMouseDown(e: google.maps.MapMouseEvent) {
    timerRef.current = setTimeout(() => {
      setSearchButton({ lat: e.latLng?.lat() ?? 0, lng: e.latLng?.lng() ?? 0 });
      timerRef.current = undefined;
    }, 500);
  }

  function handleMouseUp() {
    clearTimeout(timerRef.current);
  }

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

  function handleClickOnMarker(places: Result) {
    if (flatResults.some((result) => result.place_id === places.place_id))
      return;

    setFavoritesList((prev) => {
      if (prev.some((result) => result.place_id === places.place_id))
        return prev;
      return [places, ...prev];
    });
  }

  function handleRightClickOnMap(e: google.maps.MapMouseEvent) {
    setSearchButton({
      lat: e.latLng?.lat() ?? 0,
      lng: e.latLng?.lng() ?? 0,
    });
  }

  function handleSearchButton() {
    if (searchButton) {
      router.replace({
        pathname: "map",
        query: {
          lat: searchButton?.lat,
          lng: searchButton?.lng,
        },
      });
    }
    setSearchButton(undefined);
  }

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
  // Only runs once when component mounts
  useEffect(() => {
    if (!didMount) {
      navigator?.geolocation?.getCurrentPosition((pos) => {
        setCurrentPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
      setFavoritesList([]);
      setDidMount(true);
    }
  }, [didMount, setFavoritesList]);
  // Runs every time url query changes
  useEffect(() => {
    // Re center map
    if (!queryLatLng) return;
    mapRef.current?.panTo(queryLatLng);
    setClickedPlace(undefined);
    if (mapRef.current?.getZoom() ?? 12 < 12) mapRef.current?.setZoom(13);
    // Reset results
    setFavoritesList([]);
    setShowResults(true);
    // Close search options in mobile
    if (window?.innerWidth < 768) setShowSearchOptions(false);
  }, [
    queryLatLng,
    showFavorites,
    setShowResults,
    setShowSearchOptions,
    setClickedPlace,
    setFavoritesList,
  ]);

  useEffect(() => {
    if (showFavorites !== wasPrevFavorite) {
      setWasPrevFavorite(showFavorites);

      if (showFavorites) {
        setFavoritesList(favoriteRespose?.data?.favorites ?? []);
        setShowSearchOptions(false);
        setShowResults(true);
      }
    }
  }, [
    favoriteRespose?.data?.favorites,
    setShowResults,
    setShowSearchOptions,
    showFavorites,
    wasPrevFavorite,
    setFavoritesList,
  ]);

  return {
    queryLatLng,
    showFavorites,
    searchButton,
    handleMouseDown,
    handleMouseUp,
    clearOverlay,
    handleClickOnMarker,
    handleRightClickOnMap,
    handleSearchButton,
    selectedPlace,
    setSelectedPlace,
    getCurrentPosition,
    mapRef,
    setClickedPlace,
    showResults,
    currentPosition,
    favoritesList,
  };
}

export const DEFAULT_CENTER = {
  lat: 35.6762,
  lng: 139.6503,
};
