import {
  InfiniteData,
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { FiChevronsDown } from "react-icons/fi";
import { NearbySearchResult } from "../../types/NearbySearchResult";
import {
  SearchTypes,
  SEARCH_TYPES,
  SortOptions,
  SORT_OPTIONS,
} from "./ResultsUtil";

interface Props {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<InfiniteData<NearbySearchResult>, unknown>>;
  keyword: string | undefined;
  setKeyword: Dispatch<SetStateAction<string | undefined>>;
  queryLatLng: google.maps.LatLngLiteral | undefined;
  setType: Dispatch<SetStateAction<SearchTypes>>;
  radius: number;
  setRadius: Dispatch<SetStateAction<number>>;
  sortBy: SortOptions;
  setSortBy: Dispatch<SetStateAction<SortOptions>>;
}

export default function ResultsForm({
  refetch,
  keyword,
  setKeyword,
  queryLatLng,
  setType,
  radius,
  setRadius,
  sortBy,
  setSortBy,
}: Props) {
  const [showOptions, setShowOptions] = useState(true);

  return (
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
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
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
              max={30000}
              min={2000}
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
  );
}
