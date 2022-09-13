import { useAtom } from "jotai";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  clickedPlaceAtom,
  favoritesListAtom,
  showResultsAtom,
} from "@/utils/store";
import { useGetFavorites, useGetFavoritesId } from "@/utils/useQueryFavorites";
import ResultsCard from "./ResultsCard";
import { SortOptions, sortResults } from "./ResultsUtil";
import { useGetFlatResults, useGetResults } from "@/utils/useQueryResults";
import { useGetParams } from "./MapCanvasUtil";

interface Props {
  sortBy: SortOptions;
}

export default function ResultsList({ sortBy }: Props) {
  const [clickedPlace] = useAtom(clickedPlaceAtom);
  const [favoritesList, setFavoritesList] = useAtom(favoritesListAtom);
  const [, setShowResults] = useAtom(showResultsAtom);
  const favoritesId = useGetFavoritesId();
  const { data: session } = useSession();

  const { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetResults();

  const { queryLatLng, showFavorites } = useGetParams();
  const flatResults = useGetFlatResults();

  const { data: favoritesData } = useGetFavorites();

  useEffect(() => {
    if (showFavorites && !favoritesList.length && favoritesData?.length) {
      setShowResults(true);
      setFavoritesList(favoritesData ?? []);
    }
  }, [
    favoritesData,
    setShowResults,
    favoritesList,
    showFavorites,
    setFavoritesList,
  ]);

  if (!!flatResults.length || !!favoritesList.length) {
    return (
      <div className="mx-1 flex w-full flex-row overflow-x-auto overflow-y-hidden pt-3 md:m-[12px_8px_12px_4px] md:w-auto md:flex-col md:space-y-5 md:overflow-y-auto md:overflow-x-hidden md:py-2">
        {favoritesList.map((place) => (
          <ResultsCard
            key={place.place_id}
            place={place}
            isClicked={clickedPlace === place.place_id}
            queryLatLng={queryLatLng}
            isFavorited={!!favoritesId?.includes(place.place_id)}
            session={!!session}
          />
        ))}
        {(!isFetching || isFetchingNextPage) &&
          sortResults(flatResults, sortBy).map((place) => (
            <ResultsCard
              key={place.place_id}
              place={place}
              isClicked={clickedPlace === place.place_id}
              queryLatLng={queryLatLng}
              isFavorited={!!favoritesId?.includes(place.place_id)}
              session={!!session}
            />
          ))}
        {!(isFetching && !isFetchingNextPage) && queryLatLng && (
          <div className="flex justify-center whitespace-nowrap py-2 px-2 text-xl md:py-0">
            <button
              className={`w-full rounded-xl p-3 text-slate-100 shadow ring-1 ring-black/30  md:p-6 ${
                hasNextPage
                  ? "bg-blue-600 duration-100 hover:scale-[102%] hover:bg-blue-700 active:scale-[98%]"
                  : "bg-blue-700/50"
              }`}
              onClick={() => {
                fetchNextPage();
              }}
              disabled={isFetchingNextPage || !hasNextPage}
            >
              {hasNextPage
                ? !isFetchingNextPage
                  ? "Load more"
                  : "Searching..."
                : "No more results"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
