import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { SetStateAction, useState } from "react";
import { Dispatch, useMemo } from "react";
import { NearbySearchResult, Result } from "../../types/NearbySearchResult";
import ResultCard from "./ResultCard";
import { FiChevronsDown } from "react-icons/fi";
import {
  SearchTypes,
  SEARCH_TYPES,
  SortOptions,
  SORT_OPTIONS,
  fetchResults,
  filterResults,
  sortResults,
} from "./ResultsUtil";
import Image from "next/image";

interface Props {
  radius: number;
  setRadius: Dispatch<SetStateAction<number>>;
  selectedPlace: Result | undefined;
  setSelectedPlace: Dispatch<SetStateAction<Result | undefined>>;
}

export default function Results({
  radius,
  setRadius,
  selectedPlace,
  setSelectedPlace,
}: Props) {
  const [showOptions, setShowOptions] = useState(true);
  const [keyword, setKeyword] = useState<string>();
  const [type, setType] = useState<SearchTypes>("tourist_attraction");
  const [sortBy, setSortBy] = useState<SortOptions>("relevance");
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

  const { data, isSuccess, refetch, isFetching } = useQuery<NearbySearchResult>(
    ["nearby"],
    () => fetchResults(queryLatLng, radius, keyword, type),
    {
      enabled: false,
      select: (res) => filterResults(res, queryLatLng),
    }
  );

  return (
    <aside
      className="z-10 flex w-full
     max-w-[25vw] flex-col bg-slate-300 shadow-[0_10px_10px_5px_rgba(0,0,0,0.15)] ring-1 ring-black/10"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowOptions(false);
          refetch();
        }}
        className="bg-slate-200 px-4 shadow-md"
      >
        <div className="flex w-full items-center space-x-3 py-8">
          <div className="relative grow">
            <label htmlFor="search-keyword" className="absolute -top-6 left-1">
              Search by keyword:
            </label>
            <input
              type="text"
              id="search-keyboard"
              className="w-full rounded px-2 py-1 text-xl outline-none ring-1 ring-black/20 focus:ring-2 focus:ring-blue-500/50"
              placeholder="Optional"
              onChange={(e) => {
                setKeyword(e.target.value.trim() || undefined);
              }}
              onFocus={() => setShowOptions(true)}
            />
          </div>
          <button
            className={`h-fit whitespace-nowrap rounded-md bg-blue-700 px-4 py-3 text-white shadow-md ring-1 ring-black/20 ${
              queryLatLng
                ? "hover:bg-blue-800 active:scale-95"
                : "bg-gray-600/20 text-black"
            }`}
            disabled={!queryLatLng}
          >
            Search here
          </button>
        </div>
        <div
          className={`relative max-h-0 w-full overflow-hidden transition-all duration-300 ${
            showOptions && "max-h-[150px]"
          }`}
        >
          <div className="flex space-x-3 border-t border-t-black/20 py-4">
            <div className="basis-4/6">
              <label htmlFor="search-type" className="block">
                Filter by
              </label>
              <select
                id="search-type"
                className="mb-3 w-full rounded text-lg outline-none focus:ring-1"
                defaultValue="tourist_attraction"
                onChange={(e) => setType(e.target.value as SearchTypes)}
              >
                <option>Search all</option>
                {SEARCH_TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                    label={
                      type.charAt(0).toUpperCase() +
                      type.slice(1).replaceAll("_", " ")
                    }
                  />
                ))}
              </select>
              <label htmlFor="search-radius" className="block">
                {`Max radius: ${radius} meters`}
              </label>
              <input
                className="radius-sm w-full cursor-pointer"
                id="search-radius"
                type="range"
                value={radius}
                onChange={(e) => setRadius(+e.target.value)}
                max={50000}
                min={1000}
                step={100}
              />
            </div>
            <div className="grow">
              <label htmlFor="sort-by" className="block">
                Sort by
              </label>
              <select
                name="sort-by"
                id="sort-by"
                className="w-full rounded text-lg outline-none focus:ring-1"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOptions)}
              >
                {SORT_OPTIONS.map((sort) => (
                  <option
                    key={sort}
                    value={sort}
                    label={sort.charAt(0).toUpperCase() + sort.slice(1)}
                  />
                ))}
              </select>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="absolute left-6 z-10 block h-6 w-12 -translate-y-3 rounded border border-black/30 bg-slate-200 text-slate-700 shadow"
          onClick={() => setShowOptions((prev) => !prev)}
        >
          <FiChevronsDown
            className={`mx-auto text-xl transition-all duration-300 ${
              showOptions && "-rotate-180"
            }`}
          />
        </button>
      </form>
      <div className="m-[12px_8px_8px_4px] space-y-5 overflow-y-auto">
        {isSuccess &&
          sortResults(data, sortBy).map((place) => (
            <ResultCard
              key={place.place_id}
              place={place}
              selectedPlace={selectedPlace}
              setSelectedPlace={setSelectedPlace}
            />
          ))}
      </div>
      {isFetching && !data && (
        <div className="flex h-full w-full justify-center">
          <Image src="/loading.svg" alt="Loading..." height={150} width={150} />
        </div>
      )}
    </aside>
  );
}
