import { MarkerF } from "@react-google-maps/api";
import { useAtom } from "jotai";
import { Result } from "@/types/NearbySearchResult";
import {
<<<<<<< HEAD
  clickedPlaceAtom,
  favoritesListAtom,
  selectedPlaceAtom,
  showResultsAtom,
  showSearchOptionsAtom,
} from "@/utils/store";
import { useGetFlatResults } from "@/utils/useQueryResults";
import { handleClickOnMarker } from "./MapCanvasUtil";
=======
  favoritesListAtom,
  showResultsAtom,
  showSearchOptionsAtom,
} from "@/utils/store";
import { handleClickOnMarker } from "./MapCanvasUtil";
import { useGetFlatResults } from "@/utils/useQueryResults";
>>>>>>> 791dae1ab2780ca51afd303d552049f6194e495b

interface Props {
  places: Result;
  isFavorited: boolean;
}

<<<<<<< HEAD
export default function MapCanvasMarker({ places, isFavorited }: Props) {
  const [, setShowResults] = useAtom(showResultsAtom);
  const [, setShowSearchOptions] = useAtom(showSearchOptionsAtom);
  const [, setClickedPlace] = useAtom(clickedPlaceAtom);
  const [, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const [, setFavoritesList] = useAtom(favoritesListAtom);

  const flatResults = useGetFlatResults();
=======
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
>>>>>>> 791dae1ab2780ca51afd303d552049f6194e495b

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
