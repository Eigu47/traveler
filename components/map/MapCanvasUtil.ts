import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useState, useRef, useEffect, useCallback } from "react";
import { Result } from "../../types/NearbySearchResult";
import {
  clickedPlaceAtom,
  selectedPlaceAtom,
  showResultsAtom,
  showSearchOptionsAtom,
  favoritesListAtom,
  radiusAtom,
  searchTypeAtom,
  keywordAtom,
} from "../../utils/store";
import { useGetFavorites, useGetResults } from "../../utils/useQueryHooks";

// Handles clicks and long taps in the map
export function useHandleMouseEventsInMap(
  queryLatLng: google.maps.LatLngLiteral
) {
  const router = useRouter();
  const [searchButton, setSearchButton] = useState<google.maps.LatLngLiteral>();
  const [selectedPlace, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const [, setFavoritesList] = useAtom(favoritesListAtom);
  const [radius] = useAtom(radiusAtom);
  const [searchType] = useAtom(searchTypeAtom);
  const [keyword] = useAtom(keywordAtom);
  const timerRef = useRef<NodeJS.Timeout>();

  const { flatResults } = useGetResults(queryLatLng);

  function startPressTimer({ lat, lng }: google.maps.LatLngLiteral) {
    timerRef.current = setTimeout(() => {
      setSearchButton({ lat, lng });
      timerRef.current = undefined;
    }, 500);
  }

  function handleMouseDown(e: google.maps.MapMouseEvent) {
    startPressTimer({
      lat: e.latLng?.lat() ?? 0,
      lng: e.latLng?.lng() ?? 0,
    });
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
          radius,
          type: searchType,
          keyword,
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

  return {
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
  };
}
// Handles url query changes
export function useHandleQueryChanges(
  queryLatLng: google.maps.LatLngLiteral,
  showFavorites: boolean
) {
  const mapRef = useRef<google.maps.Map>();
  const [, setClickedPlace] = useAtom(clickedPlaceAtom);
  const [showResults, setShowResults] = useAtom(showResultsAtom);
  const [, setShowSearchOptions] = useAtom(showSearchOptionsAtom);
  const [favoritesList, setFavoritesList] = useAtom(favoritesListAtom);
  const { response } = useGetFavorites();
  const [wasPrevFavorite, setWasPrevFavorite] = useState(false);
  const [didMount, setDidMount] = useState(false);
  const [currentPosition, setCurrentPosition] =
    useState<google.maps.LatLngLiteral>();

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
    setShowResults,
    setShowSearchOptions,
    setClickedPlace,
    setFavoritesList,
  ]);
  // Runs when changes LatLng to Favorites
  useEffect(() => {
    if (showFavorites !== wasPrevFavorite) {
      setWasPrevFavorite(showFavorites);

      if (showFavorites) {
        setFavoritesList(response?.data?.favorites ?? []);
        setShowSearchOptions(false);
        setShowResults(true);
      }
    }
  }, [
    response?.data?.favorites,
    setShowResults,
    setShowSearchOptions,
    showFavorites,
    wasPrevFavorite,
    setFavoritesList,
  ]);
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

  return {
    mapRef,
    queryLatLng,
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
