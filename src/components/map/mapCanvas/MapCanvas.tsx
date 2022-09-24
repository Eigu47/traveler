import { GoogleMap } from "@react-google-maps/api/";
import { useRef, useState } from "react";
import { useAtom } from "jotai";
import SearchBar from "./MapCanvasSearchBar";
import {
  DEFAULT_CENTER,
  handleMouseDown,
  handleMouseUp,
  handleRightClickOnMap,
  useGetQueryLatLng,
  useGetShowFavoriteInMap,
} from "./MapCanvasUtil";
import MapCanvasCenter from "./MapCanvasCenter";
import MapCanvasPlaceCard from "./MapCanvasPlaceCard";
import MapCanvasSearchButton from "./MapCanvasSearchButton";
import { mapRefAtom, searchButtonAtom } from "@/utils/store";
import MapCanvasGpsButton from "./MapCanvasGpsButton";
import MapCanvasSynchronize from "./MapCanvasSynchronize";
import MapCanvasShowMarker from "./MapCanvasShowMarker";

interface Props {}

export default function MapCanvas({}: Props) {
  const [, setSearchButton] = useAtom(searchButtonAtom);
  const [, setMapRef] = useAtom(mapRefAtom);
  const timerRef = useRef<NodeJS.Timeout>();
  const [currentPosition, setCurrentPosition] =
    useState<google.maps.LatLngLiteral>();

  const queryLatLng = useGetQueryLatLng();
  const showFavInMap = useGetShowFavoriteInMap();

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
          zoom={queryLatLng || showFavInMap ? 13 : 10}
          center={showFavInMap?.latLng ?? currentPosition ?? DEFAULT_CENTER}
          mapContainerClassName="h-full w-full"
          onLoad={(map) => setMapRef(map)}
          options={{
            mapId: "a73e177530bb64aa",
            disableDefaultUI: true,
            clickableIcons: false,
          }}
          onRightClick={(e) => {
            handleRightClickOnMap(e, setSearchButton);
          }}
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
          <MapCanvasShowMarker />
          <MapCanvasPlaceCard />
          <MapCanvasSearchButton />
        </GoogleMap>
        <SearchBar />
        <MapCanvasGpsButton />
      </section>
    </MapCanvasSynchronize>
  );
}
