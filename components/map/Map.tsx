import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";
import { MdGpsFixed } from "react-icons/md";

const defaultCenter = { lat: 35.6762, lng: 139.6503 };

export default function Map() {
  // const center = useMemo(() => defaultCenter, []);

  const mapRef = useRef<GoogleMap>();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY as string,
  });

  const getCurrentPosition = useCallback(() => {
    navigator?.geolocation?.getCurrentPosition((pos) => {
      const position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      mapRef.current?.panTo(position);
    });
  }, []);

  const onLoad = useCallback(
    (map: any) => {
      mapRef.current = map;
      getCurrentPosition();
    },
    [getCurrentPosition]
  );

  if (!isLoaded) {
    return <h1>Loading...</h1>;
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
          className="absolute bottom-6 right-4 rounded-lg border bg-white p-1 text-2xl text-gray-600 shadow duration-75 ease-in-out hover:text-black"
        >
          <MdGpsFixed />
        </button>
      )}
    </section>
  );
}
