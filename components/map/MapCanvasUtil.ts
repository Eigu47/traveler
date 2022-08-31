import { SetStateAction, useAtom } from "jotai";
import { NextRouter } from "next/router";
import { Dispatch, useRef, useEffect, useCallback } from "react";
import { Result } from "../../types/NearbySearchResult";
import { allResultsAtom, selectedPlaceAtom } from "../../utils/store";

type DispatchCenterMenu = Dispatch<
  SetStateAction<google.maps.LatLngLiteral | undefined>
>;

export default function useMapCanvasUtil(setCenterMenu: DispatchCenterMenu) {
  const [, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const timerRef = useRef<NodeJS.Timeout>();

  function startPressTimer({ lat, lng }: google.maps.LatLngLiteral) {
    timerRef.current = setTimeout(() => {
      setCenterMenu({ lat, lng });
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
      if (!e) setCenterMenu(undefined);

      if (e && timerRef.current) setCenterMenu(undefined);

      if (
        (e?.target as HTMLElement)?.nodeName === "IMG" ||
        e
          ?.composedPath()
          .some((path) => (path as HTMLElement).nodeName === "ARTICLE")
      )
        return;

      setSelectedPlace(undefined);
    },

    [setCenterMenu, setSelectedPlace]
  );

  useEffect(() => {
    window.addEventListener("click", clearOverlay);

    return () => window.removeEventListener("click", clearOverlay);
  }, [clearOverlay]);

  return { handleMouseDown, handleMouseUp, clearOverlay };
}

export function getCurrentPosition(router: NextRouter) {
  navigator?.geolocation?.getCurrentPosition((pos) => {
    router.replace({
      pathname: "/map",
      query: { lat: pos.coords.latitude, lng: pos.coords.longitude },
    });
  });
}

export function handleRightClick(
  e: google.maps.MapMouseEvent,
  setCenterMenu: DispatchCenterMenu
) {
  setCenterMenu({
    lat: e.latLng?.lat() ?? 0,
    lng: e.latLng?.lng() ?? 0,
  });
}

export function handleCenterMenu(
  centerMenu: google.maps.LatLngLiteral | undefined,
  router: NextRouter,
  setCenterMenu: DispatchCenterMenu
) {
  if (centerMenu) {
    router.replace({
      pathname: "map",
      query: {
        lat: centerMenu?.lat,
        lng: centerMenu?.lng,
      },
    });
  }
  setCenterMenu(undefined);
}

export function useHandleClickMarker() {
  const [allResults, setAllResults] = useAtom(allResultsAtom);

  return (places: Result) => {
    if (allResults.some((result) => result.place_id === places.place_id))
      return;

    setAllResults([places, ...allResults]);
  };
}

export const DEFAULT_CENTER = {
  lat: 35.6762,
  lng: 139.6503,
};
