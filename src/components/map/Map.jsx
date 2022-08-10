import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";
import { MdGpsFixed } from "react-icons/md";

function getCurrentPosition() {
  navigator?.geolocation?.getCurrentPosition((pos) => {
    const position = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    };
    return position;
  });
}

export default function Map() {
  const [center, setCenter] = useState({ lat: 35.6762, lng: 139.6503 });
  const mapRef = useRef();

  const onLoad = useCallback((map) => (mapRef.current = map), []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY,
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
          onClick={() => console.log(mapRef.current)}
          className="absolute bottom-7 right-3 rounded-lg border border-black/30 bg-white p-1 text-xl text-gray-500 shadow-md duration-75 ease-in-out hover:text-black"
        >
          <MdGpsFixed />
        </button>
      )}
    </>
  );
}
