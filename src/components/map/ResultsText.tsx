import Image from "next/image";
<<<<<<< HEAD
import { useGetIsShowFavorites, useGetQueryLatLng } from "./MapCanvasUtil";
import { useGetFlatResults, useGetResults } from "@/utils/useQueryResults";
import { favoritesListAtom, showResultsAtom } from "@/utils/store";
import { useAtom } from "jotai";

interface Props {}

export default function ResultsText({}: Props) {
  const [showResults] = useAtom(showResultsAtom);
  const isShowFavorites = useGetIsShowFavorites();
  const queryLatLng = useGetQueryLatLng();
  const flatResults = useGetFlatResults();
  const [favoritesList] = useAtom(favoritesListAtom);

=======
import { useRouter } from "next/router";
import { useGetFlatResults, useGetResults } from "@/utils/useQueryResults";
import { useAtom } from "jotai";
import { favoritesListAtom, showResultsAtom } from "@/utils/store";
import { useGetParams } from "./MapCanvasUtil";

interface Props {}

export default function ResultsText({}: Props) {
  const router = useRouter();
  const isFavorites = !!router.query.favs;
  const [favoritesList] = useAtom(favoritesListAtom);
  const [showResults] = useAtom(showResultsAtom);

  const { queryLatLng } = useGetParams();
  const flatResults = useGetFlatResults();

>>>>>>> 791dae1ab2780ca51afd303d552049f6194e495b
  const { isFetching, isFetchingNextPage, isError } = useGetResults();

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
    !isShowFavorites &&
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

  if (isShowFavorites && !favoritesList.length) {
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
