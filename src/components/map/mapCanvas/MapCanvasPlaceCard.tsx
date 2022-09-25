import { OverlayView } from "@react-google-maps/api";
import { useAtom } from "jotai";
import Image from "next/image";
import { BsSuitHeartFill } from "react-icons/bs";

import { selectedPlaceAtom } from "@/utils/store";
import { useGetFavoritesId } from "@/utils/useQueryFavorites";

interface Props {}

export default function MapCanvasPlaceCard({}: Props) {
  const [selectedPlace] = useAtom(selectedPlaceAtom);
  const favoritesId = useGetFavoritesId();

  const isFavorited = !!favoritesId?.includes(
    selectedPlace?.place_id ?? "NOT_VALID_ID"
  );

  return (
    <>
      {selectedPlace && (
        <OverlayView
          position={selectedPlace.geometry.location}
          mapPaneName="overlayMouseTarget"
        >
          <div className="w-24 rounded-lg bg-slate-100 text-center shadow ring-1 ring-black/20 sm:w-48">
            <p className="px-1 text-xs sm:p-2 sm:text-lg">
              {selectedPlace.name}
            </p>
            <div className="relative">
              <Image
                className="bg-slate-400"
                src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${selectedPlace.photos[0].photo_reference}&maxheight=200&maxwidth=200&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
                alt={selectedPlace.name}
                width={250}
                height={250}
                objectFit="cover"
              />
              {isFavorited && (
                <BsSuitHeartFill className="absolute top-2 left-2 text-base text-red-500 sm:text-2xl" />
              )}
            </div>

            {selectedPlace.types
              .filter(
                (type) =>
                  type !== "point_of_interest" && type !== "establishment"
              )
              .map((type) => (
                <p className="hidden text-base sm:block" key={type}>
                  {type.charAt(0).toUpperCase() +
                    type.slice(1).replaceAll("_", " ")}
                </p>
              ))}
          </div>
        </OverlayView>
      )}
    </>
  );
}
