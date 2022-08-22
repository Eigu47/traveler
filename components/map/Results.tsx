import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState, useMemo, useEffect } from "react";
import { NearbySearchResult, Result } from "../../types/NearbySearchResult";
import ResultCard from "./ResultCard";
import {
  SearchTypes,
  SortOptions,
  fetchResults,
  addDistance,
  sortResults,
} from "./ResultsUtil";
import Image from "next/image";
import ResultsForm from "./ResultsForm";
import { FiChevronsDown } from "react-icons/fi";
import { useAtom } from "jotai";
import {
  clickedPlaceAtom,
  radiusAtom,
  searchbarOnFocusAtom,
  showResultsAtom,
} from "../../utils/store";

interface Props {}

export default function Results({}: Props) {
  const [keyword, setKeyword] = useState<string>();
  const [type, setType] = useState<SearchTypes>("tourist_attraction");
  const [sortBy, setSortBy] = useState<SortOptions>("relevance");
  const [allResults, setAllResults] = useState<Result[]>([]);
  const [showOptions, setShowOptions] = useState(true);
  const router = useRouter();
  const [radius] = useAtom(radiusAtom);
  const [clickedPlace] = useAtom(clickedPlaceAtom);
  const [searchbarOnFocus] = useAtom(searchbarOnFocusAtom);
  const [showResults, setShowResults] = useAtom(showResultsAtom);

  const queryLatLng = useMemo(() => {
    if (
      router.query.lat &&
      router.query.lng &&
      !isNaN(+router.query.lat) &&
      !isNaN(+router.query.lng)
    )
      return { lat: +router.query.lat, lng: +router.query.lng };
  }, [router.query]);

  const {
    data,
    refetch,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<NearbySearchResult>(
    ["nearby", queryLatLng],
    ({ pageParam = undefined }) =>
      fetchResults(pageParam, queryLatLng, radius, keyword, type),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      getNextPageParam: (lastPage) => {
        return lastPage.next_page_token;
      },
      onSuccess: (data) => {
        const allData = data.pages.flatMap((pages) => pages.results);
        setAllResults(addDistance(allData, queryLatLng));
      },
    }
  );

  useEffect(() => {
    if (clickedPlace) setShowOptions(false);

    if (searchbarOnFocus) setShowResults(false);
    if (searchbarOnFocus) setShowOptions(false);

    if (!data?.pages[0].results) setShowResults(false);
  }, [searchbarOnFocus, clickedPlace, data?.pages, setShowResults]);

  useEffect(() => {
    if (queryLatLng) return setShowOptions(true);

    if (window.innerWidth > 768) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  }, [queryLatLng]);

  return (
    <aside
      className={`absolute z-10 flex h-64 max-h-0 min-h-0 w-full flex-row bg-slate-300 pt-4 ring-2 ring-slate-500/80 duration-300 md:static md:h-full md:max-h-full md:min-h-full md:min-w-[420px] md:max-w-[25vw] md:flex-col md:py-0 md:shadow-[0_10px_10px_5px_rgba(0,0,0,0.15)] md:ring-1 md:ring-black/20 md:transition-none ${
        showResults && "max-h-[256px] min-h-[256px] pt-0"
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
      {data && (
        <div className="mx-1.5 flex flex-row overflow-x-auto overflow-y-hidden md:m-[12px_8px_8px_4px] md:flex-col md:space-y-5 md:overflow-y-auto md:overflow-x-hidden">
          {(isFetchingNextPage || !isFetching) &&
            sortResults(allResults, sortBy).map((place) => (
              <ResultCard
                key={place.place_id}
                place={place}
                isClicked={clickedPlace === place.place_id}
              />
            ))}
          <div className="flex justify-center whitespace-nowrap py-2 px-2 text-xl md:py-0 md:pb-4">
            {hasNextPage && (
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
            {!hasNextPage && (
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
        className={`absolute h-6 w-screen -translate-y-6 duration-300 ${
          showResults && "-translate-y-3"
        }`}
        onClick={() => setShowResults((prev) => !prev)}
      >
        <button
          type="button"
          className="mx-auto block h-6 w-2/6 rounded-md bg-gray-300 text-slate-700 shadow ring-1 ring-black/20 md:hidden"
        >
          <FiChevronsDown
            className={`mx-auto text-2xl duration-300 md:text-xl ${
              showResults && "-rotate-180"
            }`}
          />
        </button>
      </div>
      {isFetching && !isFetchingNextPage && (
        <div className="flex h-full w-full justify-center">
          <Image src="/loading.svg" alt="Loading..." height={150} width={150} />
        </div>
      )}
      {!isFetching && data?.pages[0].results.length === 0 && (
        <p className="my-auto text-center text-2xl">No results found</p>
      )}
    </aside>
  );
}
