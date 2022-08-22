import { SetStateAction } from "jotai";
import { NextRouter } from "next/router";
import { Dispatch } from "react";

export type DispatchCenterMenu = Dispatch<
  SetStateAction<google.maps.LatLngLiteral | undefined>
>;

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

export const DEFAULT_CENTER = {
  lat: 35.6762,
  lng: 139.6503,
};
