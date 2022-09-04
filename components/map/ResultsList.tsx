import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { Result } from "../../types/NearbySearchResult";
import { clickedPlaceAtom } from "../../utils/store";
import { useGetFavorites } from "../../utils/useQueryHooks";
import ResultsCard from "./ResultsCard";
import { SortOptions, sortResults } from "./ResultsUtil";

interface Props {
  favoritesList: Result[];
  queryLatLng: google.maps.LatLngLiteral | undefined;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  flatResults: Result[];
  sortBy: SortOptions;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
}

export default function ResultsList({
  favoritesList,
  queryLatLng,
  isFetching,
  isFetchingNextPage,
  flatResults,
  sortBy,
  hasNextPage,
  fetchNextPage,
}: Props) {
  const [clickedPlace] = useAtom(clickedPlaceAtom);
  const { favoritesId } = useGetFavorites();
  const { data: session } = useSession();

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
