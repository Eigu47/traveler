import Image from "next/image";
import { useRouter } from "next/router";
import { Result } from "@/types/NearbySearchResult";

interface Props {
  isFetching: boolean;
  isFetchingNextPage: boolean;
  flatResults: Result[];
  favoritesList: Result[];
  isError: boolean;
  queryLatLng: google.maps.LatLngLiteral | undefined;
  showResults: boolean;
}

export default function ResultsText({
  isFetching,
  isFetchingNextPage,
  flatResults,
  favoritesList,
  isError,
  queryLatLng,
  showResults,
}: Props) {
  const router = useRouter();
  const isFavorites = !!router.query.favs;

  if (isFetching && !isFetchingNextPage) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Image src="/loading.svg" alt="Loading..." height={150} width={150} />
      </div>
    );
  }

  if (!isFetching && !flatResults.length && queryLatLng) {
    return (
      <span
        className={`my-auto w-full text-center text-2xl transition-none duration-300 md:translate-y-0 ${
          showResults ? "translate-y-0" : "translate-y-full"
        }`}
      >
        No results found
      </span>
    );
  }

  if (
    !flatResults.length &&
    !favoritesList.length &&
    !isFetching &&
    !isFavorites &&
    !isError
  ) {
    return (
      <span
        className={`my-auto w-full text-center text-2xl transition-none duration-300 md:translate-y-0 ${
          showResults ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <span className="md:hidden">Hold tap </span>
        <span className="hidden md:block">Right click </span>
        in the map to start searching
      </span>
    );
  }

  if (isFavorites && !favoritesList.length) {
    return (
      <span
        className={`my-auto w-full text-center text-2xl transition-none duration-300 md:translate-y-0 ${
          showResults ? "translate-y-0" : "translate-y-full"
        }`}
      >
        No favorites yet
      </span>
    );
  }

  if (isError) {
    return (
      <span
        className={`my-auto w-full text-center text-2xl transition-none duration-300 md:translate-y-0 ${
          showResults ? "translate-y-0" : "translate-y-full"
        }`}
      >
        Something went wrong...
      </span>
    );
  }

  return null;
}
