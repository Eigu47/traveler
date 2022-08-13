import Image from "next/image";
import { Result } from "../../types/nearbySearchResult";
import getDistance from "../../utils/getDistance";
import Rating from "./Rating";

interface Props {
  place: Result;
  queryLatLng: { lat: number; lng: number } | undefined;
}

export default function ResultCard({ place, queryLatLng }: Props) {
  return (
    <article className="duration-50 m-2 flex cursor-pointer flex-col rounded-xl bg-slate-100 text-center text-sm shadow ring-1 ring-black/20 ease-out hover:shadow-[0_0_5px_0_#3b82f6] hover:ring-0 active:scale-[99%]">
      <div className="flex h-40 rounded-xl border-b border-black/10 bg-slate-200">
        <div className="w-40 flex-none">
          <Image
            className="rounded-l-md bg-slate-300"
            src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${place.photos[0].photo_reference}&maxheight=200&maxwidth=200&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
            alt={place.name}
            width={200}
            height={200}
            objectFit="cover"
          />
        </div>
        <div className="h-full w-full">
          <div className="my-4 flex flex-col items-center space-y-1">
            <Rating rating={place.rating} className={"text-lg"} />
            <p className="">{`${place.rating} out of ${place.user_ratings_total} rewiews.`}</p>
          </div>
          {queryLatLng && (
            <p className="">{`${getDistance(
              place.geometry.location,
              queryLatLng
            )} km from the center`}</p>
          )}
        </div>
      </div>
      <div className="w-full p-1 pb-2">
        <h4 className="text-lg">{place.name}</h4>
        <p className="">{place.vicinity}</p>
      </div>
    </article>
  );
}
