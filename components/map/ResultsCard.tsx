import { useAtom } from "jotai";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { selectedPlaceAtom } from "../../utils/store";
import { Result } from "../../types/NearbySearchResult";
import { getDistance, Rating } from "./ResultsUtil";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { useFavorites } from "../../utils/useFavoriteQuery";

interface Props {
  place: Result;
  isClicked: boolean;
  queryLatLng: google.maps.LatLngLiteral | undefined;
  isFavorited: boolean;
}

export default function ResultsCard({
  place,
  isClicked,
  queryLatLng,
  isFavorited,
}: Props) {
  const [selectedPlace, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const resultRef = useRef<HTMLElement>(null);
  const { mutate, isLoading } = useFavorites();

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
      className={`m-2 flex cursor-default select-none flex-col rounded-xl bg-slate-100 text-center text-sm shadow ring-1 ring-black/20 duration-75 ease-out md:select-auto md:text-base ${
        isSelected && "shadow-[0_0_8px_4px_#3b82f6]"
      }`}
      onMouseOver={() => setSelectedPlace(place)}
      onMouseOut={() => setSelectedPlace(undefined)}
      ref={resultRef}
    >
      <div className="flex h-36 rounded-xl border-b border-black/10 bg-slate-200 md:h-44">
        <div className="relative w-36 flex-none md:w-44">
          <Image
            className="rounded-l-md bg-slate-300"
            src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${place.photos[0].photo_reference}&maxheight=200&maxwidth=200&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
            alt={place.name}
            width={250}
            height={250}
            objectFit="cover"
          />
          <button
            className="absolute top-2 left-2 text-2xl"
            onClick={() => mutate({ place, isFavorited })}
            disabled={isLoading}
          >
            {isFavorited ? (
              <BsSuitHeartFill className="animate-favorited text-red-500" />
            ) : (
              <BsSuitHeart className="text-white" />
            )}
          </button>
        </div>
        <div className="flex w-full flex-col px-3 md:pt-2">
          <div className="w-full grow space-y-3">
            <p className="">{place.vicinity}</p>
            {queryLatLng && (
              <p className="">{`${
                place.distance ??
                getDistance(place.geometry.location, queryLatLng)
              } km from the center`}</p>
            )}
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
            <div className="flex items-center justify-center space-x-1.5 md:py-1.5">
              <span>{place.rating}</span>
              <Rating
                rating={place.rating}
                className="justify-center text-base md:text-xl"
              />
              <span className="whitespace-nowrap md:whitespace-normal">{`${place.user_ratings_total} rewiews`}</span>
            </div>
          )}
        </div>
      </div>
      <div className="w-full space-y-2 p-2 pt-4 md:space-y-4">
        <a
          href={`https://www.google.com/maps/place/?q=place_id:${place.place_id}`}
          target="_blank"
          rel="noreferrer"
          className="whitespace-nowrap text-center text-2xl hover:text-blue-700 md:whitespace-normal"
        >
          {place.name}
        </a>
        <div className="flex justify-center space-x-2 md:flex-wrap">
          {place.types
            .filter(
              (type) => type !== "point_of_interest" && type !== "establishment"
            )
            .map((type) => (
              <p
                className="whitespace-nowrap rounded-lg bg-gray-300/30  px-1 py-0.5 text-sm shadow-sm ring-1 ring-black/10 md:px-2"
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
