import Image from "next/image";
import { Result } from "../../types/NearbySearchResult";
import Rating from "./Rating";

interface Props {
  place: Result;
}

export default function ResultCard({ place }: Props) {
  return (
    <article className="m-2 flex cursor-pointer flex-col rounded-xl bg-slate-100 text-center text-sm shadow ring-1 ring-black/20 duration-75 ease-out hover:shadow-[0_0_5px_0_#3b82f6] hover:ring-0 active:scale-[99%]">
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
        <div className="flex w-full flex-col p-3 pb-0">
          <div className="w-full grow space-y-3">
            <p className="text-xs">{place.vicinity}</p>
            <p className="">{`${place.distance} km from the center`}</p>
          </div>
          {place.opening_hours && (
            <p>
              Currently
              <span className="font-medium">
                {place.opening_hours?.open_now ? " open" : " closed"}
              </span>
            </p>
          )}
          {place.rating && (
            <div className="flex items-center justify-center space-x-1.5 py-1.5 text-xs">
              <span>{place.rating}</span>
              <Rating rating={place.rating} className="justify-center" />
              <span className="">{`${place.user_ratings_total} rewiews`}</span>
            </div>
          )}
        </div>
      </div>
      <div className="w-full p-1 pb-2">
        <h4 className="text-lg">{place.name}</h4>
        <div className="flex justify-center px-2 pt-1.5">
          {place.types
            .filter(
              (type) => type !== "point_of_interest" && type !== "establishment"
            )
            .map((type) => (
              <p
                className="mx-1.5 rounded-lg bg-gray-300/30 px-1 py-0.5 text-xs shadow-sm ring-1 ring-black/5"
                key={type}
              >
                {type.charAt(0).toUpperCase() +
                  type.slice(1).replaceAll("_", " ")}
              </p>
            ))}
        </div>
      </div>
    </article>
  );
}

export function getDistance(
  pointA: google.maps.LatLngLiteral,
  pointB: google.maps.LatLngLiteral
) {
  const R = 6371;
  const dLat = (pointB.lat - pointA.lat) * (Math.PI / 180);
  const dLon = (pointB.lng - pointA.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(pointA.lat * (Math.PI / 180)) *
      Math.cos(pointB.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = Math.round(R * c * 100) / 100;
  return d;
}
