import {
  CircleF,
  GoogleMap,
  MarkerF,
  OverlayView,
} from "@react-google-maps/api/";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { MdGpsFixed, MdLocationPin } from "react-icons/md";
import SearchBar from "./SearchBar";
import { useRouter } from "next/router";
import { nearbySearchResult } from "../../types/nearbySearchResult";
import { useState } from "react";

const defaultCenter = {
  lat: 35.6762,
  lng: 139.6503,
};
export default function MapCanvas() {
  const router = useRouter();
  const mapRef = useRef<google.maps.Map>();
  const [showMenu, setShowMenu] = useState<google.maps.LatLngLiteral>();
  const { data: placesPoint } = useQuery<nearbySearchResult>(["nearby"]);

  function getCurrentPosition() {
    navigator?.geolocation?.getCurrentPosition((pos) => {
      router.replace({
        pathname: "/map",
        query: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      });
    });
  }

  const queryLatLng = useMemo(() => {
    if (
      router.query.lat &&
      router.query.lng &&
      !isNaN(+router.query.lat) &&
      !isNaN(+router.query.lng)
    )
      return { lat: +router.query.lat, lng: +router.query.lng };
  }, [router.query]);

  useEffect(() => {
    if (queryLatLng) {
      mapRef.current?.panTo(queryLatLng);
      if (mapRef.current?.getZoom() !== 14) mapRef.current?.setZoom(14);
    }
  }, [queryLatLng]);

  function handleRightClick(e: google.maps.MapMouseEvent) {
    setShowMenu({
      lat: e.latLng?.lat() ?? 0,
      lng: e.latLng?.lng() ?? 0,
    });
  }

  function handleClickBtn() {
    if (showMenu) {
      router.replace({
        pathname: "map",
        query: {
          lat: showMenu?.lat,
          lng: showMenu?.lng,
        },
      });
    }

    setShowMenu(undefined);
  }

  useEffect(() => {
    const clickOutside = () => setShowMenu(undefined);
    window.addEventListener("click", () => clickOutside);
    return () => window.removeEventListener("click", () => clickOutside);
  }, []);

  return (
    <section className="h-full w-full">
      <GoogleMap
        zoom={14}
        center={queryLatLng ?? defaultCenter}
        mapContainerClassName="h-full w-full"
        onLoad={(map) => {
          mapRef.current = map;
        }}
        onRightClick={handleRightClick}
        options={{
          mapId: "a73e177530bb64aa",
          disableDefaultUI: true,
          clickableIcons: false,
        }}
      >
        {queryLatLng && (
          <CircleF
            options={{
              center: queryLatLng,
              radius: 1500,
              strokeWeight: 0.1,
              fillColor: "DodgerBlue",
              fillOpacity: 0.07,
            }}
          />
        )}
        {placesPoint?.results.map((places) => (
          <MarkerF
            key={places.place_id}
            position={{
              lat: places.geometry.location.lat,
              lng: places.geometry.location.lng,
            }}
          />
        ))}
        {showMenu && (
          <OverlayView position={showMenu} mapPaneName="overlayMouseTarget">
            <button
              onClick={handleClickBtn}
              className="m-1 flex items-center space-x-2 rounded-md bg-slate-50 px-3 py-2 text-sm shadow ring-1 ring-black/20 hover:bg-blue-200"
            >
              <MdLocationPin className="-mx-1 text-xl" />
              <span>Set center here</span>
            </button>
          </OverlayView>
        )}
      </GoogleMap>
      {navigator.geolocation && (
        <button
          onClick={getCurrentPosition}
          className="absolute bottom-6 right-4 rounded-lg bg-white p-1 text-2xl text-gray-600 shadow-md ring-1 ring-black/20 duration-75 ease-in-out hover:text-black"
        >
          <MdGpsFixed />
        </button>
      )}
      <SearchBar />
    </section>
  );
}
