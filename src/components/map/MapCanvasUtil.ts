import { Result } from "@/types/NearbySearchResult";
import { Dispatch, SetStateAction, useMemo } from "react";
import { NextRouter, useRouter } from "next/router";

export function handleMouseUp(
  timerRef: React.MutableRefObject<NodeJS.Timeout | undefined>
) {
  clearTimeout(timerRef.current);
}

export function handleMouseDown(
  e: google.maps.MapMouseEvent,
  timerRef: React.MutableRefObject<NodeJS.Timeout | undefined>,
  setSearchButton: Dispatch<
    SetStateAction<google.maps.LatLngLiteral | undefined>
  >
) {
  timerRef.current = setTimeout(() => {
    setSearchButton({ lat: e.latLng?.lat() ?? 0, lng: e.latLng?.lng() ?? 0 });
    timerRef.current = undefined;
  }, 500);
}

export function handleClickOnMarker(
  place: Result,
  flatResults: Result[],
  setFavoritesList: Dispatch<SetStateAction<Result[]>>
) {
  if (flatResults.some((result) => result.place_id === place.place_id)) return;

  setFavoritesList((prev) => {
    if (prev.some((result) => result.place_id === place.place_id)) return prev;
    return [place, ...prev];
  });
}

export function handleRightClickOnMap(
  e: google.maps.MapMouseEvent,
  setSearchButton: Dispatch<
    SetStateAction<google.maps.LatLngLiteral | undefined>
  >
) {
  setSearchButton({
    lat: e.latLng?.lat() ?? 0,
    lng: e.latLng?.lng() ?? 0,
  });
}

export function handleSearchButton(
  searchButton: google.maps.LatLngLiteral,
  router: NextRouter,
  setSearchButton: Dispatch<
    SetStateAction<google.maps.LatLngLiteral | undefined>
  >
) {
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

export function getCurrentPosition(router: NextRouter) {
  navigator?.geolocation?.getCurrentPosition((pos) => {
    router.replace({
      pathname: "/map",
      query: { lat: pos.coords.latitude, lng: pos.coords.longitude },
    });
  });
}

export function useGetParams() {
  const router = useRouter();

  const queryLatLng = useMemo(() => {
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

  return { queryLatLng, showFavorites };
}

export const DEFAULT_CENTER = {
  lat: 35.6762,
  lng: 139.6503,
};
