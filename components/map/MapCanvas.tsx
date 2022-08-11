import { GoogleMap, Marker } from "@react-google-maps/api/";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MdGpsFixed } from "react-icons/md";
import { Boundary } from "../../pages/map";
import SearchBar from "./SearchBar";

const defaultCenter = {
  lat: 35.6762,
  lng: 139.6503,
};

interface Props {
  setBoundary: Dispatch<SetStateAction<Boundary | undefined>>;
}

export default function MapCanvas({ setBoundary }: Props) {
  const mapRef = useRef<google.maps.Map>();
  const [center, setCenter] = useState(defaultCenter);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  function getBoundary() {
    const res: any = mapRef.current?.getBounds();

    return {
      tr_longitude: res?.Ra.hi,
      tr_latitude: res?.ub.hi,
      bl_longitude: res?.Ra.lo,
      bl_latitude: res?.ub.lo,
    };
  }

  function getCurrentPosition() {
    navigator?.geolocation?.getCurrentPosition((pos) => {
      setCenter({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }

  useEffect(() => {
    if (center) {
      mapRef.current?.panTo(center);
      mapRef.current?.setZoom(14);
    }

    setBoundary(getBoundary());
  }, [center, setBoundary]);

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
      <SearchBar setCenter={setCenter} />
    </section>
  );
}
