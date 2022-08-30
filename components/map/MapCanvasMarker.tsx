import { MarkerF } from "@react-google-maps/api";
import { SetStateAction } from "jotai";
import { Result } from "../../types/NearbySearchResult";

interface Props {
  places: Result;
  setClickedPlace: (update?: SetStateAction<string | undefined>) => void;
  setSelectedPlace: (update?: SetStateAction<Result | undefined>) => void;
  isFavorited: boolean;
  handleClickMarker?: (places: Result) => void;
}

export default function MapCanvasMarker({
  places,
  setClickedPlace,
  setSelectedPlace,
  isFavorited,
  handleClickMarker,
}: Props) {
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
        if (handleClickMarker) handleClickMarker(places);
      }}
      onMouseOver={() => setSelectedPlace(places)}
      onMouseOut={() => setSelectedPlace(undefined)}
    />
  );
}
