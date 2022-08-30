import { MarkerF } from "@react-google-maps/api";
import { SetStateAction } from "jotai";
import { Result } from "../../types/NearbySearchResult";

interface Props {
  fav: Result;
  setSelectedPlace: (update?: SetStateAction<Result | undefined>) => void;
}

export default function MapCanvasFavorites({ fav, setSelectedPlace }: Props) {
  return (
    <MarkerF
      key={fav.place_id}
      position={{
        lat: fav.geometry.location.lat,
        lng: fav.geometry.location.lng,
      }}
      icon={{
        url: "/fav-pin.png",
        scaledSize: new google.maps.Size(40, 40),
      }}
      onMouseOver={() => setSelectedPlace(fav)}
      onMouseOut={() => setSelectedPlace(undefined)}
    ></MarkerF>
  );
}
