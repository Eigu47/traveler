import { GoogleMap } from "@react-google-maps/api/";
import { MdGpsFixed } from "react-icons/md";
import SearchBar from "./MapCanvasSearchBar";
import { DEFAULT_CENTER, useMapCanvas } from "./MapCanvasUtil";
import MapCanvasCenter from "./MapCanvasCenter";
import MapCanvasMarker from "./MapCanvasMarker";
import MapCanvasPlaceCard from "./MapCanvasPlaceCard";
import MapCanvasSearchMenu from "./MapCanvasSearchButton";
import { useGetFavorites, useGetResults } from "../../utils/useQueryHooks";

interface Props {}

export default function MapCanvas({}: Props) {
  const {
    queryLatLng,
    showFavorites,
    searchButton,
    handleMouseDown,
    handleMouseUp,
    clearOverlay,
    handleClickOnMarker,
    handleRightClickOnMap,
    handleSearchButton,
    selectedPlace,
    setSelectedPlace,
    getCurrentPosition,
    setMapRef,
    setClickedPlace,
    showResults,
    currentPosition,
    favoritesList,
  } = useMapCanvas();

  const {
    response: { data: favoritesData, isSuccess: favoritesIsSuccess },
    favoritesId,
  } = useGetFavorites();

  const { flatResults } = useGetResults(queryLatLng);

  return (
    <section className="relative h-full w-full bg-[#e5e3df]">
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
        onRightClick={handleRightClickOnMap}
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
        {flatResults
          .concat(favoritesList)
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
        {(showFavorites || favoritesIsSuccess) &&
          favoritesData?.favorites?.map((place) => (
            <MapCanvasMarker
              key={place.place_id}
              places={place}
              setClickedPlace={setClickedPlace}
              setSelectedPlace={setSelectedPlace}
              isFavorited={true}
              handleClickOnMarker={handleClickOnMarker}
            />
          ))}
        {selectedPlace && (
          <MapCanvasPlaceCard
            selectedPlace={selectedPlace}
            isFavorited={!!favoritesId?.includes(selectedPlace.place_id)}
          />
        )}
        {searchButton && (
          <MapCanvasSearchMenu
            searchButton={searchButton}
            handleSearchButton={handleSearchButton}
          />
        )}
      </GoogleMap>
      <SearchBar />
      <button
        onClick={getCurrentPosition}
        className={`fixed right-4 rounded-lg bg-white p-1 text-4xl text-gray-600 shadow-md ring-1 ring-black/20 duration-300 hover:text-black sm:bottom-6 md:transition-none ${
          showResults ? "bottom-72" : "bottom-12"
        }`}
      >
        <MdGpsFixed />
      </button>
    </section>
  );
}
