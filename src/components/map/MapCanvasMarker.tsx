import { MarkerF } from "@react-google-maps/api";
import { SetStateAction, useAtom } from "jotai";
import { Result } from "@/types/NearbySearchResult";
import { showResultsAtom, showSearchOptionsAtom } from "@/utils/store";

interface Props {
  places: Result;
  setClickedPlace: (update?: SetStateAction<string | undefined>) => void;
  setSelectedPlace: (update?: SetStateAction<Result | undefined>) => void;
  isFavorited: boolean;
  handleClickOnMarker?: (places: Result) => void;
}

export default function MapCanvasMarker({
  places,
  setClickedPlace,
  setSelectedPlace,
  isFavorited,
  handleClickOnMarker,
}: Props) {
  const [, setShowResults] = useAtom(showResultsAtom);
  const [, setShowSearchOptions] = useAtom(showSearchOptionsAtom);

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
        if (handleClickOnMarker) handleClickOnMarker(places);
      }}
      onMouseOver={() => setSelectedPlace(places)}
      onMouseOut={() => setSelectedPlace(undefined)}
    />
  );
}
