import { GoogleMap } from "@react-google-maps/api/";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { MdGpsFixed } from "react-icons/md";
import SearchBar from "./SearchBar";
import { travelAdvisorApi } from "../../types/travelAdvisorApi";
import { useRouter } from "next/router";

const defaultCenter = {
  lat: 35.6762,
  lng: 139.6503,
};

function fetchResults(): Promise<travelAdvisorApi> {
  return fetch("dummyData.json").then((res) => res.json());
}

export default function MapCanvas() {
  const router = useRouter();
  const mapRef = useRef<google.maps.Map>();

  function getCurrentPosition() {
    navigator?.geolocation?.getCurrentPosition((pos) => {
      router.replace({
        pathname: "/map",
        query: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      });
    });
  }

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (
      !router.query.lat ||
      !router.query.lng ||
      isNaN(+router.query.lat) ||
      isNaN(+router.query.lng)
    )
      return;

    const center = { lat: +router.query.lat, lng: +router.query.lng };

    mapRef.current?.panTo(center);
    if (mapRef.current?.getZoom() !== 14) mapRef.current?.setZoom(14);

    const mark = new google.maps.Marker({
      position: center,
      map: mapRef.current,
    });

    return () => {
      mark.setMap(null);
    };
  }, [router.query]);

  return (
    <section className="h-full w-full">
      <GoogleMap
        zoom={14}
        center={defaultCenter}
        mapContainerClassName="h-full w-full"
        onLoad={onLoad}
        options={{
          mapId: "a73e177530bb64aa",
          disableDefaultUI: true,
          clickableIcons: false,
        }}
      ></GoogleMap>
      {navigator.geolocation && (
        <button
          onClick={getCurrentPosition}
          className="absolute bottom-6 right-4 rounded-lg bg-white p-1 text-2xl text-gray-600 shadow-md ring-1 ring-black ring-opacity-5 duration-75 ease-in-out hover:text-black"
        >
          <MdGpsFixed />
        </button>
      )}
      <SearchBar />
    </section>
  );
}
