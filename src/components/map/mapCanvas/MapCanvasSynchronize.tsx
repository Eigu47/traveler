import {
  clickedPlaceAtom,
  favoritesListAtom,
  mapRefAtom,
  searchButtonAtom,
  selectedPlaceAtom,
  showFavInMapAtom,
  showResultsAtom,
  showSearchOptionsAtom,
} from "@/utils/store";
import { useGetFavorites } from "@/utils/useQueryFavorites";
import { useAtom } from "jotai";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
  useRef,
} from "react";
import { useGetIsShowFavorites, useGetQueryLatLng } from "./MapCanvasUtil";

interface Props {
  children: JSX.Element;
  setCurrentPosition: Dispatch<
    SetStateAction<google.maps.LatLngLiteral | undefined>
  >;
  timerRef: MutableRefObject<NodeJS.Timeout | undefined>;
}

export default function MapCanvasSynchronize({
  children,
  setCurrentPosition,
  timerRef,
}: Props) {
  const [, setSearchButton] = useAtom(searchButtonAtom);
  const [, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const [favoritesList, setFavoritesList] = useAtom(favoritesListAtom);
  const [mapRef] = useAtom(mapRefAtom);
  const [, setClickedPlace] = useAtom(clickedPlaceAtom);
  const [, setShowResults] = useAtom(showResultsAtom);
  const [, setShowSearchOptions] = useAtom(showSearchOptionsAtom);
  const [, setShowFavInMap] = useAtom(showFavInMapAtom);
  const didMount = useRef(false);
  const queryLatLng = useGetQueryLatLng();

  useEffect(() => {
    function clearOverlay(e: MouseEvent) {
      if (timerRef.current) setSearchButton(undefined);
      if (
        (e.target as HTMLElement).nodeName === "IMG" ||
        e
          .composedPath()
          .some((path) => (path as HTMLElement).nodeName === "ARTICLE")
      )
        return;

      setSelectedPlace(undefined);
    }

    window.addEventListener("click", clearOverlay);

    return () => window.removeEventListener("click", clearOverlay);
  }, [setSelectedPlace, setSearchButton, timerRef]);
  // Runs once when component mounts
  useEffect(() => {
    if (!didMount.current) {
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
      didMount.current = true;
      setFavoritesList([]);
    }
  }, [
    setFavoritesList,
    setShowResults,
    setShowSearchOptions,
    setClickedPlace,
    setCurrentPosition,
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
    setShowFavInMap(undefined);
    // Close search options in mobile
    if (window?.innerWidth < 768) setShowSearchOptions(false);
  }, [
    queryLatLng,
    setShowResults,
    setShowSearchOptions,
    setClickedPlace,
    setFavoritesList,
    setShowFavInMap,
    mapRef,
  ]);

  const isShowFavorites = useGetIsShowFavorites();
  const { data: favoritesData } = useGetFavorites();

  useEffect(() => {
    if (isShowFavorites && !favoritesList.length && !!favoritesData?.length) {
      setFavoritesList(favoritesData ?? []);
      setShowFavInMap(undefined);
    }
  }, [
    favoritesData,
    setShowResults,
    mapRef,
    favoritesList,
    isShowFavorites,
    setFavoritesList,
    setShowFavInMap,
  ]);

  return children;
}
