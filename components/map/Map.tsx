import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import Image from "next/image";
import { useCallback, useRef } from "react";
import { MdGpsFixed } from "react-icons/md";

const defaultCenter = { lat: 35.6762, lng: 139.6503 };

export default function Map() {
  const mapRef = useRef<google.maps.Map>();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY as string,
    libraries: ["places"],
  });

  // const isLoaded = false;

  const getCurrentPosition = useCallback(() => {
    navigator?.geolocation?.getCurrentPosition((pos) => {
      const position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      mapRef.current?.panTo(position);
    });
  }, []);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      getCurrentPosition();
    },
    [getCurrentPosition]
  );

  if (!isLoaded) {
    return (
      <div className="flex w-full items-center justify-center bg-slate-200">
        <Image src="/loading.svg" alt="Loading..." height={200} width={200} />
      </div>
    );
  }

  return (
    <section className="h-full w-full">
      <GoogleMap
        zoom={12}
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
    </section>
  );
}
