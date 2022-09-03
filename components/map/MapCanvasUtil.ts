import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useState, useRef, useEffect, useCallback } from "react";
import { Result } from "../../types/NearbySearchResult";
import {
  allResultsAtom,
  clickedPlaceAtom,
  selectedPlaceAtom,
  showResultsAtom,
  showSearchOptionsAtom,
} from "../../utils/store";
import { useGetFavorites } from "../../utils/useQueryHooks";

// Handles clicks and long taps in the map
export function useHandleMouseEventsInMap() {
  const router = useRouter();
  const [searchButton, setSearchButton] = useState<google.maps.LatLngLiteral>();
  const [selectedPlace, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const [allResults, setAllResults] = useAtom(allResultsAtom);
  const timerRef = useRef<NodeJS.Timeout>();

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
    if (allResults.some((result) => result.place_id === places.place_id))
      return;

    setAllResults([places, ...allResults]);
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
  const [allResults, setAllResults] = useAtom(allResultsAtom);
  const [, setClickedPlace] = useAtom(clickedPlaceAtom);
  const [showResults, setShowResults] = useAtom(showResultsAtom);
  const [, setShowSearchOptions] = useAtom(showSearchOptionsAtom);
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
    setAllResults([]);
    setShowResults(true);
    // Close search options in mobile
    if (window?.innerWidth < 768) setShowSearchOptions(false);
  }, [
    queryLatLng,
    setAllResults,
    setShowResults,
    setShowSearchOptions,
    setClickedPlace,
  ]);
  // Runs when changes LatLng to Favorites
  useEffect(() => {
    if (showFavorites !== wasPrevFavorite) {
      setWasPrevFavorite(showFavorites);

      if (showFavorites) {
        setShowSearchOptions(false);
        setShowResults(true);
        setAllResults(response?.data?.favorites ?? []);
      }
    }
  }, [
    response?.data?.favorites,
    setAllResults,
    setShowResults,
    setShowSearchOptions,
    showFavorites,
    wasPrevFavorite,
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
      setAllResults([]);
      setDidMount(true);
    }
  }, [didMount, setAllResults]);

  return {
    mapRef,
    allResults,
    queryLatLng,
    setClickedPlace,
    showResults,
    currentPosition,
  };
}

export const DEFAULT_CENTER = {
  lat: 35.6762,
  lng: 139.6503,
};
