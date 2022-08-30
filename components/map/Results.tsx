import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState, useMemo, useEffect } from "react";
import { Result } from "../../types/NearbySearchResult";
import ResultCard from "./ResultsCard";
import {
  SearchTypes,
  SortOptions,
  fetchResults,
  addDistance,
  sortResults,
  getFavorites,
} from "./ResultsUtil";
import Image from "next/image";
import ResultsForm from "./ResultsForm";
import { FiChevronDown } from "react-icons/fi";
import { useAtom } from "jotai";
import {
  clickedPlaceAtom,
  radiusAtom,
  searchbarOnFocusAtom,
  showHamburgerAtom,
  showResultsAtom,
} from "../../utils/store";
import { useSession } from "next-auth/react";

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
  const [showHamburger] = useAtom(showHamburgerAtom);
  const { data: session } = useSession();

  const userId = (session?.user as { _id: string | null })?._id;

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
    isError,
  } = useInfiniteQuery(
    ["nearby", queryLatLng],
    ({ pageParam = undefined }) =>
      fetchResults(queryLatLng, pageParam, radius, keyword, type),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      getNextPageParam: (lastPage) => {
        return lastPage?.next_page_token;
      },
      onSuccess: (data) => {
        const allData = data.pages.flatMap((pages) => pages?.results);
        setAllResults(addDistance(allData, queryLatLng));
      },
    }
  );

  const { data: favorites } = useQuery(["favorites", userId], getFavorites, {
    enabled: !!session,
  });

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
      setShowResults(true);

      if (window?.innerWidth < 768) setShowOptions(false);
    }
  }, [queryLatLng, refetch, setShowResults]);

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
      {data && (
        <div className="mx-1 flex w-full flex-row overflow-x-auto overflow-y-hidden pt-3 md:m-[12px_8px_12px_4px] md:w-auto md:flex-col md:space-y-5 md:overflow-y-auto md:overflow-x-hidden md:py-0">
          {(isFetchingNextPage || !isFetching) &&
            sortResults(allResults, sortBy).map((place) => (
              <ResultCard
                key={place.place_id}
                place={place}
                isClicked={clickedPlace === place.place_id}
                userId={userId}
              />
            ))}
          <div className="flex justify-center whitespace-nowrap py-2 px-2 text-xl md:py-0">
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
        <div className="flex h-full w-full justify-center">
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
