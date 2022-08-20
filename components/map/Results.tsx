import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { SetStateAction, useState } from "react";
import { Dispatch, useMemo } from "react";
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

interface Props {
  radius: number;
  setRadius: Dispatch<SetStateAction<number>>;
  selectedPlace: Result | undefined;
  setSelectedPlace: Dispatch<SetStateAction<Result | undefined>>;
  clickedPlace: string | undefined;
}

export default function Results({
  radius,
  setRadius,
  selectedPlace,
  setSelectedPlace,
  clickedPlace,
}: Props) {
  const [keyword, setKeyword] = useState<string>();
  const [type, setType] = useState<SearchTypes>("tourist_attraction");
  const [sortBy, setSortBy] = useState<SortOptions>("relevance");
  const [allResults, setAllResults] = useState<Result[]>([]);
  const router = useRouter();

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
      getNextPageParam: (lastPage) => {
        return lastPage.next_page_token;
      },
      onSuccess: (data) => {
        const allData = data.pages.flatMap((pages) => pages.results);
        setAllResults(addDistance(allData, queryLatLng));
      },
    }
  );

  return (
    <aside
      className="z-10 flex w-full
     max-w-[25vw] flex-col bg-slate-300 shadow-[0_10px_10px_5px_rgba(0,0,0,0.15)] ring-1 ring-black/10"
    >
      <ResultsForm
        refetch={refetch}
        keyword={keyword}
        setKeyword={setKeyword}
        queryLatLng={queryLatLng}
        setType={setType}
        radius={radius}
        setRadius={setRadius}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      {data && (
        <div className="m-[12px_8px_8px_4px] space-y-5 overflow-y-auto">
          {(isFetchingNextPage || !isFetching) &&
            sortResults(allResults, sortBy).map((place) => (
              <ResultCard
                key={place.place_id}
                place={place}
                selectedPlace={selectedPlace}
                setSelectedPlace={setSelectedPlace}
                isClicked={clickedPlace === place.place_id}
              />
            ))}
          <div className="flex justify-center p-2 pb-4 text-xl">
            {hasNextPage && (
              <button
                className="w-full rounded-xl bg-blue-600 p-6 text-slate-100 shadow ring-1 ring-black/30 duration-100 hover:scale-[102%] hover:bg-blue-700 active:scale-[98%]"
                onClick={() => {
                  fetchNextPage();
                }}
                disabled={isFetchingNextPage}
              >
                {!isFetchingNextPage ? "Load more" : "Searching..."}
              </button>
            )}
            {!hasNextPage && (
              <p className="w-full rounded-xl bg-blue-700/50 p-6 text-center text-slate-100 shadow ring-1 ring-black/30 duration-100">
                No more results
              </p>
            )}
          </div>
        </div>
      )}
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
