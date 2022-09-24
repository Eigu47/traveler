import { CircleF, MarkerF } from "@react-google-maps/api";
import { useAtom } from "jotai";
import { radiusAtom } from "@/utils/store";
import { useGetQueryLatLng } from "./MapCanvasUtil";

interface Props {}

export default function MapCanvasCenter({}: Props) {
  const [radius] = useAtom(radiusAtom);
  const queryLatLng = useGetQueryLatLng();

  return (
    <>
      {queryLatLng && (
        <div data-test-id="center-marker">
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
        </div>
      )}
    </>
  );
}
