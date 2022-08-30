import { useState, useEffect } from "react";
import ResultsCard from "./ResultsCard";
import { SearchTypes, SortOptions, sortResults } from "./ResultsUtil";
import Image from "next/image";
import ResultsForm from "./ResultsForm";
import { FiChevronDown } from "react-icons/fi";
import { useAtom } from "jotai";
import {
  allResultsAtom,
  clickedPlaceAtom,
  favoritesIdAtom,
  queryLatLngAtom,
  radiusAtom,
  searchbarOnFocusAtom,
  showHamburgerAtom,
  showResultsAtom,
} from "../../utils/store";
import { useSession } from "next-auth/react";
import { useGetResults } from "../../utils/useResultsQuery";

interface Props {}

export default function Results({}: Props) {
  const [keyword, setKeyword] = useState<string>();
  const [type, setType] = useState<SearchTypes>("tourist_attraction");
  const [sortBy, setSortBy] = useState<SortOptions>("relevance");
  const [showOptions, setShowOptions] = useState(true);
  const [allResults, setAllResults] = useAtom(allResultsAtom);
  const [queryLatLng] = useAtom(queryLatLngAtom);
  const [radius] = useAtom(radiusAtom);
  const [clickedPlace] = useAtom(clickedPlaceAtom);
  const [searchbarOnFocus] = useAtom(searchbarOnFocusAtom);
  const [showResults, setShowResults] = useAtom(showResultsAtom);
  const [showHamburger] = useAtom(showHamburgerAtom);
  const [favoritesId] = useAtom(favoritesIdAtom);
  const { data: session } = useSession();
  const userId = (session?.user as { _id: string | null })?._id;

  const {
    data,
    refetch,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useGetResults({ queryLatLng, radius, keyword, type, setAllResults });

  useEffect(() => {
    if (clickedPlace) {
      setShowOptions(false);
      setShowResults(true);
    }

    if (searchbarOnFocus) {
      setShowResults(false);
      setShowOptions(false);
    }

    if (!data?.pages[0]?.results) setShowResults(false);
  }, [searchbarOnFocus, clickedPlace, data?.pages, setShowResults]);

  useEffect(() => {
    if (showHamburger) setShowOptions(false);
  }, [showHamburger]);

  useEffect(() => {
    if (queryLatLng) {
      // refetch();
      setAllResults([]);
      setShowResults(true);

      if (window?.innerWidth < 768) setShowOptions(false);
    }
  }, [queryLatLng, refetch, setShowResults, setAllResults]);

  return (
    <aside
      className={`absolute z-10 flex h-64 w-full flex-row bg-slate-300 ring-1 ring-black/50 duration-300 md:static md:h-full md:min-w-[420px] md:max-w-[25vw] md:flex-col md:shadow-[0_10px_10px_5px_rgba(0,0,0,0.15)] md:ring-1 md:ring-black/20 md:transition-none ${
        showResults ? "bottom-0" : "-bottom-60"
      }`}
    >
      <ResultsForm
        refetch={refetch}
        keyword={keyword}
        setKeyword={setKeyword}
        queryLatLng={queryLatLng}
        setType={setType}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showOptions={showOptions}
        setShowOptions={setShowOptions}
        setShowResults={setShowResults}
      />
      {(data || allResults.length > 0) && (
        <div className="mx-1 flex w-full flex-row overflow-x-auto overflow-y-hidden pt-3 md:m-[12px_8px_12px_4px] md:w-auto md:flex-col md:space-y-5 md:overflow-y-auto md:overflow-x-hidden md:py-0">
          {(isFetchingNextPage || !isFetching) &&
            sortResults(allResults, sortBy).map((place) => (
              <ResultsCard
                key={place.place_id}
                place={place}
                isClicked={clickedPlace === place.place_id}
                queryLatLng={queryLatLng}
                isFavorited={!!favoritesId?.includes(place.place_id)}
              />
            ))}
          <div className="flex justify-center whitespace-nowrap py-2 px-2 text-xl md:py-0">
            {hasNextPage && !isFetching && data && (
              <button
                className="w-full rounded-xl bg-blue-600 p-3 text-slate-100 shadow ring-1 ring-black/30 duration-100 hover:scale-[102%] hover:bg-blue-700 active:scale-[98%] md:p-6"
                onClick={() => {
                  fetchNextPage();
                }}
                disabled={isFetchingNextPage}
              >
                {!isFetchingNextPage ? "Load more" : "Searching..."}
              </button>
            )}
            {!hasNextPage && data && (
              <button
                className="w-full rounded-xl bg-blue-700/50 p-3 text-slate-100 shadow ring-1 ring-black/30 duration-100 md:p-6"
                disabled
              >
                No more results
              </button>
            )}
          </div>
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
        <p className="my-auto text-center text-2xl">No results found</p>
      )}
      {isError && (
        <p className="my-auto text-center text-2xl">Something went wrong...</p>
      )}
    </aside>
  );
}
