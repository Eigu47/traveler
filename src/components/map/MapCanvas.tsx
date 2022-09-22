import { GoogleMap } from "@react-google-maps/api/";
import { useRef, useState } from "react";
import { useAtom } from "jotai";
import SearchBar from "./MapCanvasSearchBar";
import {
  DEFAULT_CENTER,
  handleMouseDown,
  handleMouseUp,
  handleRightClickOnMap,
  useGetIsShowFavorites,
  useGetQueryLatLng,
} from "./MapCanvasUtil";
import MapCanvasCenter from "./MapCanvasCenter";
import MapCanvasMarker from "./MapCanvasMarker";
import MapCanvasPlaceCard from "./MapCanvasPlaceCard";
import MapCanvasSearchMenu from "./MapCanvasSearchButton";
import { useGetFavorites, useGetFavoritesId } from "@/utils/useQueryFavorites";
import { useGetFlatResults } from "@/utils/useQueryResults";
import { favoritesListAtom, mapRefAtom, searchButtonAtom } from "@/utils/store";
import MapCanvasGpsButton from "./MapCanvasGpsButton";
import MapCanvasSynchronize from "./MapCanvasSynchronize";

interface Props {}

export default function MapCanvas({}: Props) {
  const [, setSearchButton] = useAtom(searchButtonAtom);
  const [favoritesList] = useAtom(favoritesListAtom);
  const [, setMapRef] = useAtom(mapRefAtom);
  const timerRef = useRef<NodeJS.Timeout>();
  const [currentPosition, setCurrentPosition] =
    useState<google.maps.LatLngLiteral>();

  const queryLatLng = useGetQueryLatLng();
  const isShowFavorites = useGetIsShowFavorites();
  const { data: favoritesData, isSuccess: favoritesIsSuccess } =
    useGetFavorites();
  const favoritesId = useGetFavoritesId();
  const flatResults = useGetFlatResults();

  return (
    <MapCanvasSynchronize
      setCurrentPosition={setCurrentPosition}
      timerRef={timerRef}
    >
      <section
        className="relative h-full w-full bg-[#e5e3df]"
        data-test-id="map-canvas"
      >
        <GoogleMap
          zoom={queryLatLng ? 13 : 10}
          center={currentPosition ?? DEFAULT_CENTER}
          mapContainerClassName="h-full w-full"
          onLoad={(map) => setMapRef(map)}
          options={{
            mapId: "a73e177530bb64aa",
            disableDefaultUI: true,
            clickableIcons: false,
          }}
          onRightClick={(e) => handleRightClickOnMap(e, setSearchButton)}
          onMouseDown={(e) => handleMouseDown(e, timerRef, setSearchButton)}
          onMouseUp={() => handleMouseUp(timerRef)}
          onCenterChanged={() => {
            handleMouseUp(timerRef);
            setSearchButton(undefined);
          }}
          onZoomChanged={() => {
            handleMouseUp(timerRef);
            setSearchButton(undefined);
          }}
        >
          <MapCanvasCenter />
          {flatResults
            .concat(favoritesList)
            .filter((result) => !favoritesId?.includes(result.place_id))
            .map((place) => (
              <MapCanvasMarker
                key={place.place_id}
                places={place}
                isFavorited={false}
              />
            ))}
          {(isShowFavorites || favoritesIsSuccess) &&
            favoritesData?.map((place) => (
              <MapCanvasMarker
                key={place.place_id}
                places={place}
                isFavorited={true}
              />
            ))}
          <MapCanvasPlaceCard />
          <MapCanvasSearchMenu />
        </GoogleMap>
        <SearchBar />
        <MapCanvasGpsButton />
      </section>
    </MapCanvasSynchronize>
  );
}
