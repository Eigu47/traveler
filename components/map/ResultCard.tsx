import Image from "next/image";
import { SetStateAction, useRef } from "react";
import { Dispatch } from "react";
import { Result } from "../../types/NearbySearchResult";
import Rating from "./Rating";
import { SiGooglemaps } from "react-icons/si";
import { useEffect } from "react";

interface Props {
  place: Result;
  selectedPlace: Result | undefined;
  setSelectedPlace: Dispatch<SetStateAction<Result | undefined>>;
  isClicked: boolean;
}

export default function ResultCard({
  place,
  selectedPlace,
  setSelectedPlace,
  isClicked,
}: Props) {
  const resultRef = useRef<HTMLElement>(null);

  const isSelected = selectedPlace?.place_id === place.place_id;

  useEffect(() => {
    if (isClicked)
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, [isClicked]);

  return (
    <article
      className={`m-2 flex cursor-default flex-col rounded-xl bg-slate-100 text-center shadow ring-1 ring-black/20 duration-75 ease-out ${
        isSelected && "shadow-[0_0_8px_4px_#3b82f6]"
      }`}
      onMouseOver={() => setSelectedPlace(place)}
      onMouseOut={() => setSelectedPlace(undefined)}
      ref={resultRef}
    >
      <div className="flex h-44 rounded-xl border-b border-black/10 bg-slate-200">
        <div className="w-44 flex-none">
          <Image
            className="rounded-l-md bg-slate-300"
            src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${place.photos[0].photo_reference}&maxheight=200&maxwidth=200&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
            alt={place.name}
            width={250}
            height={250}
            objectFit="cover"
          />
        </div>
        <div className="flex w-full flex-col px-3 pt-2">
          <div className="w-full grow space-y-3">
            <p className="">{place.vicinity}</p>
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
            <div className="flex items-center justify-center space-x-1.5 py-1.5">
              <span>{place.rating}</span>
              <Rating
                rating={place.rating}
                className="justify-center text-xl"
              />
              <span className="">{`${place.user_ratings_total} rewiews`}</span>
            </div>
          )}
        </div>
      </div>
      <div className="w-full space-y-4 p-2 pt-4">
        <div className="inline-block">
          <a
            href={`https://www.google.com/maps/place/?q=place_id:${place.place_id}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center text-2xl hover:text-blue-700"
          >
            <SiGooglemaps className="mr-2" size={24} />
            {place.name}
          </a>
        </div>
        <div className="flex justify-center px-2">
          {place.types
            .filter(
              (type) => type !== "point_of_interest" && type !== "establishment"
            )
            .map((type) => (
              <p
                className="mx-1.5 rounded-lg bg-gray-300/30 px-2 py-0.5 text-sm shadow-sm ring-1 ring-black/10"
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
