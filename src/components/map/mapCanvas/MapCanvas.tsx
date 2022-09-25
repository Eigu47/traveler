import { useRef, useState } from "react";

import { GoogleMap } from "@react-google-maps/api/";
import { useAtom } from "jotai";

import MapCanvasCenter from "@/components/map/mapCanvas/MapCanvasCenter";
import MapCanvasGpsButton from "@/components/map/mapCanvas/MapCanvasGpsButton";
import MapCanvasPlaceCard from "@/components/map/mapCanvas/MapCanvasPlaceCard";
import SearchBar from "@/components/map/mapCanvas/MapCanvasSearchBar";
import MapCanvasSearchButton from "@/components/map/mapCanvas/MapCanvasSearchButton";
import MapCanvasShowMarker from "@/components/map/mapCanvas/MapCanvasShowMarker";
import MapCanvasSynchronize from "@/components/map/mapCanvas/MapCanvasSynchronize";
import {
  DEFAULT_CENTER,
  handleMouseDown,
  handleMouseUp,
  handleRightClickOnMap,
  useGetQueryLatLng,
  useGetShowFavoriteInMap,
} from "@/components/map/mapCanvas/MapCanvasUtil";
import { mapRefAtom, searchButtonAtom } from "@/utils/store";

interface Props {}

export default function MapCanvas({}: Props) {
  const [, setSearchButton] = useAtom(searchButtonAtom);
  const [, setMapRef] = useAtom(mapRefAtom);
  const timerRef = useRef<NodeJS.Timeout>();
  const [currentPosition, setCurrentPosition] =
    useState<google.maps.LatLngLiteral>();

  const queryLatLng = useGetQueryLatLng();
  const showFavInMap = useGetShowFavoriteInMap();

  const favInMapLatLng = showFavInMap && showFavInMap.latLng;

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
          zoom={queryLatLng || !!showFavInMap ? 13 : 10}
          center={favInMapLatLng ?? currentPosition ?? DEFAULT_CENTER}
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
