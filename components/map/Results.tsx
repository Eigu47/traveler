import { useState, useEffect, useMemo } from "react";
import ResultsCard from "./ResultsCard";
import { SortOptions, sortResults } from "./ResultsUtil";
import Image from "next/image";
import ResultsForm from "./ResultsForm";
import { FiChevronDown } from "react-icons/fi";
import { useAtom } from "jotai";
import {
  allResultsAtom,
  clickedPlaceAtom,
  queryLatLngAtom,
  searchbarOnFocusAtom,
  showResultsAtom,
  showSearchOptionsAtom,
} from "../../utils/store";
import { useGetFavorites, useGetResults } from "../../utils/useQueryHooks";

interface Props {}

export default function Results({}: Props) {
  const [sortBy, setSortBy] = useState<SortOptions>("relevance");
  const [, setShowSearchOptions] = useAtom(showSearchOptionsAtom);
  const [allResults] = useAtom(allResultsAtom);
  const [queryLatLng] = useAtom(queryLatLngAtom);
  const [clickedPlace] = useAtom(clickedPlaceAtom);
  const [searchbarOnFocus] = useAtom(searchbarOnFocusAtom);
  const [showResults, setShowResults] = useAtom(showResultsAtom);

  const {
    data,
    refetch,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useGetResults();

  const { data: favoritesData } = useGetFavorites();

  const favoritesId = useMemo(
    () => favoritesData?.favorites?.flatMap((fav) => fav.place_id),
    [favoritesData]
  );

  useEffect(() => {
    if (clickedPlace) {
      setShowSearchOptions(false);
      setShowResults(true);
    }

    if (searchbarOnFocus) {
      setShowResults(false);
      setShowSearchOptions(false);
    }

    if (allResults.length < 0 && !clickedPlace) setShowResults(false);
  }, [
    searchbarOnFocus,
    clickedPlace,
    allResults.length,
    setShowResults,
    setShowSearchOptions,
  ]);

  // useEffect(() => {
  //   if (queryLatLng) refetch();
  // }, [queryLatLng, refetch]);

  return (
    <aside
      className={`absolute z-10 flex h-64 w-full flex-row bg-slate-300 ring-1 ring-black/50 duration-300 md:static md:h-full md:min-w-[420px] md:max-w-[25vw] md:flex-col md:shadow-[0_10px_10px_5px_rgba(0,0,0,0.15)] md:ring-1 md:ring-black/20 md:transition-none ${
        showResults ? "bottom-0" : "-bottom-60"
      }`}
    >
      <ResultsForm refetch={refetch} sortBy={sortBy} setSortBy={setSortBy} />
      {allResults.length > 0 && (
        <div className="mx-1 flex w-full flex-row overflow-x-auto overflow-y-hidden pt-3 md:m-[12px_8px_12px_4px] md:w-auto md:flex-col md:space-y-5 md:overflow-y-auto md:overflow-x-hidden md:py-2">
          {(!isFetching || isFetchingNextPage) &&
            sortResults(allResults, sortBy).map((place) => (
              <ResultsCard
                key={place.place_id}
                place={place}
                isClicked={clickedPlace === place.place_id}
                queryLatLng={queryLatLng}
                isFavorited={!!favoritesId?.includes(place.place_id)}
              />
            ))}
          {!(isFetching && !isFetchingNextPage) && (
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
      )}
      <div
        className="absolute -top-2 w-screen duration-200 md:hidden"
        onClick={() => setShowResults((prev) => !prev)}
      >
        <button
          type="button"
          className="mx-auto block w-2/6 rounded-md bg-gray-300 text-slate-700 shadow ring-1 ring-black/20"
        >
          <FiChevronDown
            className={`mx-auto text-2xl duration-300 md:text-xl ${
              showResults ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>
      </div>
      {isFetching && !isFetchingNextPage && (
        <div className="flex h-full w-full items-center justify-center">
          <Image src="/loading.svg" alt="Loading..." height={150} width={150} />
        </div>
      )}
      {!isFetching && data?.pages[0]?.results.length === 0 && (
        <p className="my-auto w-full text-center text-2xl">No results found</p>
      )}
      {isError && (
        <p className="my-auto w-full text-center text-2xl">
          Something went wrong...
        </p>
      )}
    </aside>
  );
}
