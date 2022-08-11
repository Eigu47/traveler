import { GoogleMap, Marker } from "@react-google-maps/api/";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { MdGpsFixed } from "react-icons/md";
import { Boundary } from "../../pages/map";

const defaultCenter: google.maps.LatLngLiteral = {
  lat: 35.6762,
  lng: 139.6503,
};

interface Props {
  setBoundary: Dispatch<SetStateAction<Boundary | undefined>>;
}

export default function MapCanvas({ setBoundary }: Props) {
  const mapRef = useRef<google.maps.Map>();
  const router = useRouter();

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  function getCurrentPosition() {
    navigator?.geolocation?.getCurrentPosition((pos) => {
      router.replace({
        pathname: "/map",
        query: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      });
    });
  }

  useEffect(() => {
    const { lat, lng } = router.query;

    if (!lat || !lng || (isNaN(+lat) && isNaN(+lng))) return;

    mapRef.current?.panTo({ lat: +lat, lng: +lng });
    mapRef.current?.setZoom(14);

    const res: any = mapRef.current?.getBounds();

    const bounds: Boundary = {
      tr_longitude: res?.Ra.hi,
      tr_latitude: res?.ub.hi,
      bl_longitude: res?.Ra.lo,
      bl_latitude: res?.ub.lo,
    };

    setBoundary(bounds);

    console.log(bounds);
  }, [router.query, setBoundary]);

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
    </section>
  );
}
