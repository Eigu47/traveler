import {
  CircleF,
  GoogleMap,
  MarkerF,
  OverlayView,
} from "@react-google-maps/api/";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Dispatch,
  useEffect,
  useMemo,
  useRef,
  SetStateAction,
  useState,
} from "react";
import { MdGpsFixed, MdLocationPin } from "react-icons/md";
import { useRouter } from "next/router";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { NearbySearchResult, Result } from "../../types/NearbySearchResult";

interface Props {
  radius: number;
  selectedPlace: Result | undefined;
  setSelectedPlace: Dispatch<SetStateAction<Result | undefined>>;
  setClickedPlace: Dispatch<SetStateAction<string | undefined>>;
  isLoaded: boolean;
  searchbarOnFocus: boolean;
  setSearchbarOnFocus: Dispatch<SetStateAction<boolean>>;
}

export default function MapCanvas({
  radius,
  selectedPlace,
  setSelectedPlace,
  setClickedPlace,
  isLoaded,
  searchbarOnFocus,
  setSearchbarOnFocus,
}: Props) {
  const router = useRouter();
  const mapRef = useRef<google.maps.Map>();
  const [showMenu, setShowMenu] = useState<google.maps.LatLngLiteral>();
  const [loadFinish, setLoadFinish] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const queryLatLng = useMemo(() => {
    if (
      router.query.lat &&
      router.query.lng &&
      !isNaN(+router.query.lat) &&
      !isNaN(+router.query.lng)
    )
      return { lat: +router.query.lat, lng: +router.query.lng };
  }, [router.query]);

  const { data, isSuccess } = useInfiniteQuery<NearbySearchResult>(
    ["nearby", queryLatLng],
    {
      enabled: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  function getCurrentPosition() {
    navigator?.geolocation?.getCurrentPosition((pos) => {
      router.replace({
        pathname: "/map",
        query: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      });
    });
  }

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

  function handleMouseDown(e: google.maps.MapMouseEvent) {
    startPressTimer({
      lat: e.latLng?.lat() ?? 0,
      lng: e.latLng?.lng() ?? 0,
    });
  }

  function handleMouseUp() {
    clearTimeout(timerRef.current);
  }

  function startPressTimer({ lat, lng }: google.maps.LatLngLiteral) {
    timerRef.current = setTimeout(() => {
      setShowMenu({ lat, lng });
      timerRef.current = undefined;
    }, 500);
  }

  function handleClick() {
    if (timerRef.current) setShowMenu(undefined);
  }

  useEffect(() => {
    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <section className="relative h-full w-full bg-[#e5e3df]">
      {!loadFinish && (
        <div className="flex h-full w-full items-center justify-center">
          <Image src="/loading.svg" alt="Loading..." height={200} width={200} />
        </div>
      )}
      {isLoaded && (
        <>
          <GoogleMap
            zoom={queryLatLng ? 13 : 10}
            center={queryLatLng ?? DEFAULT_CENTER}
            mapContainerClassName="h-full w-full"
            onLoad={(map) => {
              mapRef.current = map;
              setLoadFinish(true);
            }}
            options={{
              mapId: "a73e177530bb64aa",
              disableDefaultUI: true,
              clickableIcons: false,
            }}
            onRightClick={handleRightClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onCenterChanged={() => {
              handleMouseUp();
              handleClick();
            }}
            onZoomChanged={() => {
              handleMouseUp();
              handleClick();
            }}
          >
            {queryLatLng && (
              <>
                <CircleF
                  options={{
                    center: queryLatLng,
                    radius: radius,
                    clickable: false,
                    strokeWeight: 0.1,
                    fillColor: "DodgerBlue",
                    fillOpacity: 0.1,
                  }}
                />
                <MarkerF position={queryLatLng} clickable={false} />
              </>
            )}
            {isSuccess &&
              data.pages.map((page) =>
                page.results.map((places) => (
                  <MarkerF
                    key={places.place_id}
                    position={{
                      lat: places.geometry.location.lat,
                      lng: places.geometry.location.lng,
                    }}
                    icon={{
                      url: places.icon,
                      scaledSize: new google.maps.Size(35, 35),
                    }}
                    onClick={() => {
                      setClickedPlace(places.place_id);
                      setSelectedPlace(places);
                    }}
                    onMouseOver={() => setSelectedPlace(places)}
                    onMouseOut={() => setSelectedPlace(undefined)}
                  />
                ))
              )}
            {selectedPlace && (
              <OverlayView
                position={selectedPlace.geometry.location}
                mapPaneName="overlayMouseTarget"
              >
                <div className="w-24 rounded-lg bg-slate-100 text-center shadow ring-1 ring-black/20 sm:w-48">
                  <p className="px-1 text-xs sm:p-2 sm:text-lg">
                    {selectedPlace.name}
                  </p>
                  <Image
                    className="bg-slate-400"
                    src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${selectedPlace.photos[0].photo_reference}&maxheight=200&maxwidth=200&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
                    alt={selectedPlace.name}
                    width={250}
                    height={250}
                    objectFit="cover"
                  />
                  {selectedPlace.types
                    .filter(
                      (type) =>
                        type !== "point_of_interest" && type !== "establishment"
                    )
                    .map((type) => (
                      <p className="hidden text-base sm:block" key={type}>
                        {type.charAt(0).toUpperCase() +
                          type.slice(1).replaceAll("_", " ")}
                      </p>
                    ))}
                </div>
              </OverlayView>
            )}
            {showMenu && (
              <OverlayView position={showMenu} mapPaneName="overlayMouseTarget">
                <button
                  onClick={handleClickBtn}
                  className="m-1 flex items-center space-x-1 rounded-md bg-slate-50 px-1 py-2 text-sm shadow ring-1 ring-black/20 hover:bg-blue-200 md:space-x-2 md:py-2 md:px-3 md:text-lg"
                >
                  <MdLocationPin className="-mx-1 select-none text-2xl" />
                  <span>Set center here</span>
                </button>
              </OverlayView>
            )}
          </GoogleMap>
          <SearchBar setSearchbarOnFocus={setSearchbarOnFocus} />
        </>
      )}
      <button
        onClick={getCurrentPosition}
        className="absolute bottom-6 right-4 rounded-lg bg-white p-1 text-4xl text-gray-600 shadow-md ring-1 ring-black/20 duration-75 ease-in-out hover:text-black"
      >
        <MdGpsFixed />
      </button>
    </section>
  );
}

const DEFAULT_CENTER = {
  lat: 35.6762,
  lng: 139.6503,
};
