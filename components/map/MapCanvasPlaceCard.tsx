import { OverlayView } from "@react-google-maps/api";
import Image from "next/image";
import { Result } from "../../types/NearbySearchResult";

interface Props {
  selectedPlace: Result;
}

export default function MapCanvasPlaceCard({ selectedPlace }: Props) {
  return (
    <OverlayView
      position={selectedPlace.geometry.location}
      mapPaneName="overlayMouseTarget"
    >
      <div className="w-24 rounded-lg bg-slate-100 text-center shadow ring-1 ring-black/20 sm:w-48">
        <p className="px-1 text-xs sm:p-2 sm:text-lg">{selectedPlace.name}</p>
        <Image
          className="bg-slate-400"
          src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${selectedPlace.photos[0].photo_reference}&maxheight=200&maxwidth=200&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
          alt={selectedPlace.name}
          width={250}
          height={250}
          objectFit="cover"
        />
        {selectedPlace.types
          .filter(
            (type) => type !== "point_of_interest" && type !== "establishment"
          )
          .map((type) => (
            <p className="hidden text-base sm:block" key={type}>
              {type.charAt(0).toUpperCase() +
                type.slice(1).replaceAll("_", " ")}
            </p>
          ))}
      </div>
    </OverlayView>
  );
}
