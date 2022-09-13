import { MarkerF } from "@react-google-maps/api";
import { SetStateAction, useAtom } from "jotai";
import { Result } from "@/types/NearbySearchResult";
import {
  favoritesListAtom,
  showResultsAtom,
  showSearchOptionsAtom,
} from "@/utils/store";
import { handleClickOnMarker } from "./MapCanvasUtil";
import { useGetFlatResults } from "@/utils/useQueryResults";

interface Props {
  places: Result;
  setClickedPlace: (update?: SetStateAction<string | undefined>) => void;
  setSelectedPlace: (update?: SetStateAction<Result | undefined>) => void;
  isFavorited: boolean;
}

export default function MapCanvasMarker({
  places,
  setClickedPlace,
  setSelectedPlace,
  isFavorited,
}: Props) {
  const [, setShowResults] = useAtom(showResultsAtom);
  const [, setShowSearchOptions] = useAtom(showSearchOptionsAtom);
  const flatResults = useGetFlatResults();
  const [, setFavoritesList] = useAtom(favoritesListAtom);

  return (
    <MarkerF
      key={places.place_id}
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
  );
}
