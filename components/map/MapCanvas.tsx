import {
  CircleF,
  GoogleMap,
  MarkerF,
  OverlayView,
  useLoadScript,
} from "@react-google-maps/api/";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { MdGpsFixed, MdLocationPin } from "react-icons/md";
import SearchBar from "./SearchBar";
import { useRouter } from "next/router";
import { nearbySearchResult } from "../../types/nearbySearchResult";
import { useState } from "react";
import Image from "next/image";

const defaultCenter = {
  lat: 35.6762,
  lng: 139.6503,
};

interface Props {
  range: number;
}

const libraries: (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[] = ["places"];

export default function MapCanvas({ range }: Props) {
  const router = useRouter();
  const mapRef = useRef<google.maps.Map>();
  const [showMenu, setShowMenu] = useState<google.maps.LatLngLiteral>();
  const { data: placesPoint } = useQuery<nearbySearchResult>(["nearby"]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY as string,
    libraries,
  });

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

      if (mapRef.current?.getZoom() ?? 12 < 12) mapRef.current?.setZoom(13);
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
    <section className="h-full w-full bg-[#e5e3df]">
      {isLoaded ? (
        <>
          <GoogleMap
            zoom={13}
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
                  radius: range,
                  clickable: false,
                  strokeWeight: 0.1,
                  fillColor: "DodgerBlue",
                  fillOpacity: 0.1,
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
          <SearchBar />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Image src="/loading.svg" alt="Loading..." height={200} width={200} />
        </div>
      )}
      <button
        onClick={getCurrentPosition}
        className="absolute bottom-6 right-4 rounded-lg bg-white p-1 text-2xl text-gray-600 shadow-md ring-1 ring-black/20 duration-75 ease-in-out hover:text-black"
      >
        {navigator?.geolocation && <MdGpsFixed />}
      </button>
    </section>
  );
}
