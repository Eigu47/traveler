import {
  CircleF,
  GoogleMap,
  MarkerF,
  OverlayView,
} from "@react-google-maps/api/";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdGpsFixed, MdLocationPin } from "react-icons/md";
import { useRouter } from "next/router";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { NearbySearchResult } from "../../types/NearbySearchResult";
import { useAtom } from "jotai";
import {
  clickedPlaceAtom,
  radiusAtom,
  selectedPlaceAtom,
  showResultsAtom,
} from "../../utils/store";
import useMapCanvasUtil, {
  DEFAULT_CENTER,
  getCurrentPosition,
  handleCenterMenu,
  handleRightClick,
} from "./useMapCanvasUtil";

interface Props {
  isLoaded: boolean;
}

export default function MapCanvas({ isLoaded }: Props) {
  const router = useRouter();
  const mapRef = useRef<google.maps.Map>();
  const [centerMenu, setCenterMenu] = useState<google.maps.LatLngLiteral>();
  const [loadFinish, setLoadFinish] = useState(false);
  const [radius] = useAtom(radiusAtom);
  const [selectedPlace, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const [, setClickedPlace] = useAtom(clickedPlaceAtom);
  const [showResults] = useAtom(showResultsAtom);
  const { handleMouseDown, handleMouseUp, clearOverlay } = useMapCanvasUtil(
    setCenterMenu,
    setSelectedPlace
  );

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

  useEffect(() => {
    if (queryLatLng) {
      mapRef.current?.panTo(queryLatLng);

      setClickedPlace(undefined);

      if (mapRef.current?.getZoom() ?? 12 < 12) mapRef.current?.setZoom(13);
    }
  }, [queryLatLng, setClickedPlace]);

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
            onRightClick={(e) => handleRightClick(e, setCenterMenu)}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onCenterChanged={() => {
              handleMouseUp();
              clearOverlay();
            }}
            onZoomChanged={() => {
              handleMouseUp();
              clearOverlay();
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
                      setSelectedPlace(() => places);
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
            {centerMenu && (
              <OverlayView
                position={centerMenu}
                mapPaneName="overlayMouseTarget"
              >
                <button
                  onClick={() =>
                    handleCenterMenu(centerMenu, router, setCenterMenu)
                  }
                  className="m-1 flex items-center space-x-1 rounded-md bg-slate-50 px-2 py-2 text-sm shadow ring-1 ring-black/20 hover:bg-blue-200 md:space-x-2 md:py-2 md:px-3 md:text-lg"
                >
                  <MdLocationPin className="-mx-1 select-none text-2xl text-blue-900" />
                  <span>Search here</span>
                </button>
              </OverlayView>
            )}
          </GoogleMap>
          <SearchBar mapRef={mapRef} />
        </>
      )}
      <button
        onClick={() => getCurrentPosition(router)}
        className={`fixed right-4 rounded-lg bg-white p-1 text-4xl text-gray-600 shadow-md ring-1 ring-black/20 duration-300 hover:text-black sm:bottom-6 md:transition-none ${
          showResults ? "bottom-72" : "bottom-12"
        }`}
      >
        <MdGpsFixed />
      </button>
    </section>
  );
}
