import { useState } from "react";

import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";

import { Rating } from "@/components/map/results/ResultsCardRating";
import { MostFavoritesData } from "@/types/NearbySearchResult";
import { showFavInMapAtom } from "@/utils/store";
import {
  useGetFavoritesId,
  useMutateFavorites,
} from "@/utils/useQueryFavorites";
import useTimeout from "@/utils/useTimeout";

interface Props {
  staticFav: MostFavoritesData;
  favTimes: number | undefined;
}

export default function MostLikedPlacesCard({ staticFav, favTimes }: Props) {
  const { place } = staticFav;
  const { data: session } = useSession();
  const { mutate, isLoading } = useMutateFavorites();
  const favoritesId = useGetFavoritesId();
  const [delay, setDelay] = useState<number | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [, setShowFavInMap] = useAtom(showFavInMapAtom);

  const isFavorited = !!favoritesId?.includes(place.place_id);

  useTimeout(() => {
    setDelay(null);
    setShowPopover(false);
  }, delay);

  return (
    <article className="flex flex-col rounded-xl bg-slate-200 text-center shadow-xl ring-1 ring-black/20 md:flex-row lg:flex-col 2xl:flex-row">
      <div className="relative flex">
        <Image
          className="rounded-l-xl bg-slate-300"
          src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${place.photos[0].photo_reference}&maxheight=400&maxwidth=400&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
          alt={place.name}
          width={320}
          height={288}
          objectFit="cover"
        />
        <div className="absolute top-3 left-3 text-3xl">
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
          <div className="absolute left-4 top-12 z-10 w-48 animate-popover rounded-md bg-black/80 p-2 text-sm text-white shadow-lg">
            Sign in to add to favorites
          </div>
        )}
      </div>
      <div className="flex h-full w-80 flex-col space-y-3 p-4 pt-6">
        <div className="flex grow items-center justify-center">
          <Link
            href={{
              pathname: "/map",
              query: { show: place.name },
            }}
          >
            <a
              onClick={() => setShowFavInMap(place)}
              className="text-2xl hover:text-blue-700"
            >
              {place.name}
            </a>
          </Link>
        </div>
        <p>{place.vicinity}</p>
        {place.opening_hours && (
          <p>
            Currently
            <span className="font-medium">
              {place.opening_hours?.open_now ? " open" : " closed"}
            </span>
          </p>
        )}
        {place.rating && (
          <div className="flex items-center justify-center space-x-1.5">
            <span>{place.rating}</span>
            <Rating rating={place.rating} />
            <span className="whitespace-nowrap">{`${place.user_ratings_total} reviews`}</span>
          </div>
        )}
        <p>{favTimes ?? 0} likes</p>
        <ul className="flex flex-wrap justify-center space-x-2">
          {place.types
            .filter(
              (type) => type !== "point_of_interest" && type !== "establishment"
            )
            .map((type) => (
              <li
                className="whitespace-nowrap rounded-lg bg-gray-300/30 py-0.5 px-2 text-sm shadow ring-1 ring-black/10"
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
