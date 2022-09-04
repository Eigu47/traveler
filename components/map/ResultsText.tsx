import Image from "next/image";
import { useRouter } from "next/router";
import { Result } from "../../types/NearbySearchResult";

interface Props {
  isFetching: boolean;
  isFetchingNextPage: boolean;
  flatResults: Result[];
  favoritesList: Result[];
  isError: boolean;
}

export default function ResultsText({
  isFetching,
  isFetchingNextPage,
  flatResults,
  favoritesList,
  isError,
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

  if (
    !flatResults.length &&
    !favoritesList.length &&
    !isFetching &&
    !isFavorites &&
    !isError
  ) {
    return (
      <span className="my-auto w-full text-center text-2xl">
        <span className="md:hidden">Hold tap </span>
        <span className="hidden md:block">Right click </span>
        in the map to start searching
      </span>
    );
  }

  if (!isFetching && !flatResults.length) {
    return (
      <span className="my-auto w-full text-center text-2xl">
        No results found
      </span>
    );
  }

  if (isFavorites && !favoritesList.length) {
    return (
      <span className="my-auto w-full text-center text-2xl">
        No favorites yet
      </span>
    );
  }

  if (isError) {
    return (
      <span className="my-auto w-full text-center text-2xl">
        Something went wrong...
      </span>
    );
  }

  return null;
}
