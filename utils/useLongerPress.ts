import {
  useRef,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { Result } from "../types/NearbySearchResult";

interface Props {
  setCenterMenu: Dispatch<
    SetStateAction<google.maps.LatLngLiteral | undefined>
  >;
  setSelectedPlace: Dispatch<SetStateAction<Result | undefined>>;
}

export default function useLongerPress({
  setCenterMenu,
  setSelectedPlace,
}: Props) {
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

      if ((e?.target as HTMLElement)?.localName !== "img")
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
