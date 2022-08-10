import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";
import { MdGpsFixed } from "react-icons/md";

export default function Map() {
  const [center, setCenter] = useState({ lat: 35.6762, lng: 139.6503 });
  const mapRef = useRef(null);

  const getCurrentPosition = useCallback(() => {
    navigator?.geolocation?.getCurrentPosition((pos) => {
      setCenter({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }, []);

  const onLoad = useCallback(
    (map) => {
      mapRef.current = map;
      getCurrentPosition();
    },
    [getCurrentPosition]
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY as string,
  });

  if (!isLoaded) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <GoogleMap
        zoom={12}
        center={center}
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
          className="absolute bottom-7 right-3 rounded-lg border border-black/30 bg-white p-1 text-xl text-gray-500 shadow-md duration-75 ease-in-out hover:text-black"
        >
          <MdGpsFixed />
        </button>
      )}
    </>
  );
}
