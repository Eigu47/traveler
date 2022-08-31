import { GoogleMap } from "@react-google-maps/api/";
import { useEffect, useRef, useState, useMemo } from "react";
import { MdGpsFixed } from "react-icons/md";
import { useRouter } from "next/router";
import SearchBar from "./MapCanvasSearchBar";
import { useAtom } from "jotai";
import {
  allResultsAtom,
  clickedPlaceAtom,
  queryLatLngAtom,
  selectedPlaceAtom,
  showResultsAtom,
  showSearchOptionsAtom,
} from "../../utils/store";
import useMapCanvasUtil, {
  DEFAULT_CENTER,
  getCurrentPosition,
  handleRightClick,
  useHandleClickMarker,
} from "./MapCanvasUtil";
import MapCanvasCenter from "./MapCanvasCenter";
import MapCanvasMarker from "./MapCanvasMarker";
import MapCanvasPlaceCard from "./MapCanvasPlaceCard";
import MapCanvasSearchMenu from "./MapCanvasSearchMenu";
import { useGetFavorites } from "../../utils/useQueryHooks";

interface Props {}

export default function MapCanvas({}: Props) {
  const router = useRouter();
  const mapRef = useRef<google.maps.Map>();
  const [centerMenu, setCenterMenu] = useState<google.maps.LatLngLiteral>();
  const [allResults, setAllResults] = useAtom(allResultsAtom);
  const [queryLatLng, setQueryLatLng] = useAtom(queryLatLngAtom);
  const [selectedPlace, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const [, setClickedPlace] = useAtom(clickedPlaceAtom);
  const [showResults, setShowResults] = useAtom(showResultsAtom);
  const [, setShowSearchOptions] = useAtom(showSearchOptionsAtom);
  const { handleMouseDown, handleMouseUp, clearOverlay } =
    useMapCanvasUtil(setCenterMenu);
  const handleClickMarker = useHandleClickMarker();

  const { data: favoritesData, isSuccess: favoritesIsSuccess } =
    useGetFavorites();

  const favoritesId = useMemo(
    () => favoritesData?.favorites?.flatMap((fav) => fav.place_id),
    [favoritesData]
  );

  useEffect(() => {
    if (
      !(
        router.query.lat &&
        router.query.lng &&
        !isNaN(+router.query.lat) &&
        !isNaN(+router.query.lng)
      )
    )
      return;

    const latLng = { lat: +router.query.lat, lng: +router.query.lng };
    setQueryLatLng(latLng);

    mapRef.current?.panTo(latLng);
    setClickedPlace(undefined);
    if (mapRef.current?.getZoom() ?? 12 < 12) mapRef.current?.setZoom(13);

    setAllResults([]);
    setShowResults(true);

    if (window?.innerWidth < 768) setShowSearchOptions(false);
  }, [
    router.query,
    setQueryLatLng,
    setClickedPlace,
    setAllResults,
    setShowSearchOptions,
    setShowResults,
  ]);

  return (
    <section className="relative h-full w-full bg-[#e5e3df]">
      <GoogleMap
        zoom={queryLatLng ? 13 : 10}
        center={queryLatLng ?? DEFAULT_CENTER}
        mapContainerClassName="h-full w-full"
        onLoad={(map) => {
          mapRef.current = map;
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
        {queryLatLng && <MapCanvasCenter queryLatLng={queryLatLng} />}
        {allResults
          .filter((result) => !favoritesId?.includes(result.place_id))
          .map((place) => (
            <MapCanvasMarker
              key={place.place_id}
              places={place}
              setClickedPlace={setClickedPlace}
              setSelectedPlace={setSelectedPlace}
              isFavorited={false}
            />
          ))}
        {favoritesIsSuccess &&
          favoritesData.favorites?.map((place) => (
            <MapCanvasMarker
              key={place.place_id}
              places={place}
              setClickedPlace={setClickedPlace}
              setSelectedPlace={setSelectedPlace}
              isFavorited={true}
              handleClickMarker={handleClickMarker}
            />
          ))}
        {selectedPlace && (
          <MapCanvasPlaceCard
            selectedPlace={selectedPlace}
            isFavorited={!!favoritesId?.includes(selectedPlace.place_id)}
          />
        )}
        {centerMenu && (
          <MapCanvasSearchMenu
            centerMenu={centerMenu}
            router={router}
            setCenterMenu={setCenterMenu}
          />
        )}
      </GoogleMap>
      <SearchBar />
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
