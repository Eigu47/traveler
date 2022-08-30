import { MarkerF } from "@react-google-maps/api";
import { SetStateAction } from "jotai";
import { Result } from "../../types/NearbySearchResult";

interface Props {
  places: Result;
  setClickedPlace: (update?: SetStateAction<string | undefined>) => void;
  setSelectedPlace: (update?: SetStateAction<Result | undefined>) => void;
  favoritesId: string[] | undefined;
}

export default function MapCanvasResultMarker({
  places,
  setClickedPlace,
  setSelectedPlace,
  favoritesId,
}: Props) {
  const isFav = favoritesId?.includes(places.place_id);

  return (
    <MarkerF
      key={places.place_id}
      position={{
        lat: places.geometry.location.lat,
        lng: places.geometry.location.lng,
      }}
      icon={{
        url: isFav ? "/fav-pin.png" : places.icon,
        scaledSize: new google.maps.Size(isFav ? 40 : 35, isFav ? 40 : 35),
      }}
      onClick={() => {
        setClickedPlace(places.place_id);
        setSelectedPlace(places);
      }}
      onMouseOver={() => setSelectedPlace(places)}
      onMouseOut={() => setSelectedPlace(undefined)}
    />
  );
}
