import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

export default function Map() {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    } else {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  }, []);

  if (!isLoaded) {
    return <h1>Loading...</h1>;
  }

  return (
    <GoogleMap
      zoom={10}
      center={center}
      mapContainerClassName="h-full w-full"
      options={{
        disableDefaultUI: true,
        clickableIcons: false,
      }}
    ></GoogleMap>
  );
}
