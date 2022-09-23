import { useAtom } from "jotai";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { clickedPlaceAtom, mapRefAtom, selectedPlaceAtom } from "@/utils/store";
import { Result } from "@/types/NearbySearchResult";
import { getDistance, handleClickOnCard } from "./ResultsUtil";
import { Rating } from "./ResultsCardRating";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import {
  useGetFavoritesId,
  useMutateFavorites,
} from "@/utils/useQueryFavorites";
import useTimeout from "@/utils/useTimeout";
import { useSession } from "next-auth/react";

interface Props {
  place: Result;
  queryLatLng: google.maps.LatLngLiteral | undefined;
}

export default function ResultsCard({ place, queryLatLng }: Props) {
  const [selectedPlace, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const resultRef = useRef<HTMLElement>(null);
  const { mutate, isLoading } = useMutateFavorites();
  const [mapRef] = useAtom(mapRefAtom);
  const [delay, setDelay] = useState<number | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [clickedPlace] = useAtom(clickedPlaceAtom);
  const favoritesId = useGetFavoritesId();
  const { data: session } = useSession();

  const isSelected = selectedPlace?.place_id === place.place_id;
  const isClicked = clickedPlace === place.place_id;
  const isFavorited = !!favoritesId?.includes(place.place_id);

  useEffect(() => {
    if (isClicked)
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, [isClicked]);

  useTimeout(() => {
    setDelay(null);
    setShowPopover(false);
  }, delay);

  return (
    <article
      className={`m-2 flex cursor-default select-none flex-col rounded-xl bg-slate-100 text-center text-sm shadow ring-1 ring-black/20 duration-75 ease-out md:select-auto md:text-base ${
        isSelected && "shadow-[0_0_8px_4px_#3b82f6]"
      }`}
      onMouseOver={() => setSelectedPlace(place)}
      onMouseOut={() => setSelectedPlace(undefined)}
      onClick={() => handleClickOnCard(mapRef, place)}
      ref={resultRef}
      data-test-id="result-card"
    >
      <div className="flex h-36 rounded-xl border-b border-black/10 bg-slate-200 md:h-44">
        <div className="relative w-36 flex-none md:w-44">
          <Image
            className="rounded-l-xl bg-slate-300"
            src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${place.photos[0].photo_reference}&maxheight=300&maxwidth=300&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
            alt={place.name}
            width={250}
            height={250}
            objectFit="cover"
          />
          <div className="absolute top-2 left-2 text-2xl">
            <button
              onClick={() => {
                if (!!session) {
                  mutate({ place, isFavorited });
                  return;
                }
                setDelay(1500);
                setShowPopover(true);
              }}
              disabled={isLoading}
              className="outline-none"
            >
              {isFavorited && (
                <BsSuitHeartFill className="animate-favorited text-red-500" />
              )}
              {!isFavorited && <BsSuitHeart className="text-white" />}
            </button>
          </div>
          {showPopover && (
            <div className="absolute left-3 top-9 z-10 w-48 animate-popover rounded-md bg-black/80 p-2 text-sm text-white shadow-lg">
              Sign in to add to favorites
            </div>
          )}
        </div>
        <div className="flex w-full flex-col px-3 md:pt-2">
          <div className="w-full grow space-y-3">
            <p>{place.vicinity}</p>
            {queryLatLng && (
              <p>{`${getDistance(
                place.geometry.location,
                queryLatLng
              )} km from the center`}</p>
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
              <Rating rating={place.rating} />
              <span className="whitespace-nowrap md:whitespace-normal">{`${place.user_ratings_total} reviews`}</span>
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
        <ul className="flex justify-center space-x-2 md:flex-wrap">
          {place.types
            .filter(
              (type) => type !== "point_of_interest" && type !== "establishment"
            )
            .map((type) => (
              <li
                className="whitespace-nowrap rounded-lg bg-gray-300/30  px-1 py-0.5 text-sm shadow-sm ring-1 ring-black/10 md:px-2"
                key={type}
              >
                {type.charAt(0).toUpperCase() +
                  type.slice(1).replaceAll("_", " ")}
              </li>
            ))}
        </ul>
      </div>
    </article>
  );
}
