import { MarkerF } from "@react-google-maps/api";
import { useAtom } from "jotai";

import { handleClickOnMarker } from "@/components/map/mapCanvas/MapCanvasUtil";
import { Result } from "@/types/NearbySearchResult";
import {
  clickedPlaceAtom,
  favoritesListAtom,
  selectedPlaceAtom,
  showResultsAtom,
  showSearchOptionsAtom,
} from "@/utils/store";
import { useGetFlatResults } from "@/utils/useQueryResults";

interface Props {
  places: Result;
  isFavorited: boolean;
}

export default function MapCanvasMarker({ places, isFavorited }: Props) {
  const [, setShowResults] = useAtom(showResultsAtom);
  const [, setShowSearchOptions] = useAtom(showSearchOptionsAtom);
  const [, setClickedPlace] = useAtom(clickedPlaceAtom);
  const [, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const [, setFavoritesList] = useAtom(favoritesListAtom);

  const flatResults = useGetFlatResults();

  return (
    <div data-test-id={isFavorited ? "fav-marker" : "result-marker"}>
      <MarkerF
        position={{
          lat: places.geometry.location.lat,
          lng: places.geometry.location.lng,
        }}
        icon={{
          url: isFavorited ? "/fav-pin.png" : places.icon,
          scaledSize: new google.maps.Size(
            isFavorited ? 40 : 35,
            isFavorited ? 40 : 35
          ),
        }}
        onClick={() => {
          setClickedPlace(places.place_id);
          setSelectedPlace(places);
          setShowSearchOptions(false);
          setShowResults(true);
          if (isFavorited)
            handleClickOnMarker(places, flatResults, setFavoritesList);
        }}
        onMouseOver={() => setSelectedPlace(places)}
        onMouseOut={() => setSelectedPlace(undefined)}
      />
    </div>
  );
}
