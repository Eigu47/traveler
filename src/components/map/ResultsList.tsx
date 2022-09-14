import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { clickedPlaceAtom, favoritesListAtom } from "@/utils/store";
import { useGetFavoritesId } from "@/utils/useQueryFavorites";
import ResultsCard from "./ResultsCard";
import { SortOptions, sortResults } from "./ResultsUtil";
import { useGetQueryLatLng } from "./MapCanvasUtil";
import { useGetFlatResults, useGetResults } from "@/utils/useQueryResults";

interface Props {
  sortBy: SortOptions;
}

export default function ResultsList({ sortBy }: Props) {
  const [clickedPlace] = useAtom(clickedPlaceAtom);
  const favoritesId = useGetFavoritesId();
  const [favoritesList] = useAtom(favoritesListAtom);
  const { data: session } = useSession();

  const queryLatLng = useGetQueryLatLng();
  const flatResults = useGetFlatResults();

  const { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetResults();

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
