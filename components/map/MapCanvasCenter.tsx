import { CircleF, MarkerF } from "@react-google-maps/api";
import { useAtom } from "jotai";
import { radiusAtom } from "../../utils/store";

interface Props {
  queryLatLng: google.maps.LatLngLiteral;
}

export default function MapCanvasCenter({ queryLatLng }: Props) {
  const [radius] = useAtom(radiusAtom);

  return (
    <>
      <CircleF
        options={{
          center: queryLatLng,
          radius: radius,
          clickable: false,
          strokeWeight: 0.1,
          fillColor: "DodgerBlue",
          fillOpacity: 0.1,
        }}
      />
      <MarkerF position={queryLatLng} clickable={false} />
    </>
  );
}
