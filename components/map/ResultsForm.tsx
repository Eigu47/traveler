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
      className={`relative flex min-w-0 max-w-0 flex-col whitespace-nowrap bg-slate-200 px-3 shadow-md ring-1 ring-black/10 duration-300 sm:block sm:min-w-full sm:max-w-full sm:px-4 sm:transition-none ${
        showOptions && "min-w-[calc(100vw-30px)] max-w-[calc(100vw-30px)]"
      }`}
    >
      <div className="flex w-full flex-col items-center justify-center space-x-3 space-y-3 overflow-hidden pt-6 pb-3 sm:flex-row sm:space-y-0 sm:overflow-visible sm:py-8">
        <div className="relative w-full">
          <label
            htmlFor="search-keyword"
            className="absolute -top-5 left-1 text-sm sm:-top-6 sm:text-base"
          >
            Search by keyword:
          </label>
          <input
            type="text"
            id="search-keyboard"
            className="w-full rounded px-2 py-1 text-xl outline-none ring-1 ring-black/20 focus:ring-2 focus:ring-blue-500/50 sm:py-1"
            placeholder="Optional"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setShowOptions(true)}
          />
        </div>
        <button
          className={`h-fit rounded-md bg-blue-700 px-12 py-3 text-white shadow-md ring-1 ring-black/20 sm:px-4 ${
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
        className={`relative w-full overflow-hidden duration-300 sm:max-h-0 ${
          showOptions && "sm:max-h-[170px]"
        }`}
      >
        <div className="flex flex-col border-t border-t-black/20 py-4">
          <div className="flex space-x-4">
            <div className="w-4/6">
              <label
                htmlFor="search-type"
                className="block text-sm sm:text-base"
              >
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
            </div>
            <div className="w-2/6">
              <label htmlFor="sort-by" className="block text-sm sm:text-base">
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
          <div className="">
            <label
              htmlFor="search-radius"
              className="block text-sm sm:text-base"
            >
              {`Max radius: ${radius} meters`}
            </label>
            <input
              className="w-full cursor-pointer"
              id="search-radius"
              type="range"
              value={radius}
              onChange={(e) => setRadius(+e.target.value)}
              max={30000}
              min={2000}
              step={100}
            />
          </div>
        </div>
      </div>
      <button
        type="button"
        className="absolute -right-6 z-10 block h-6 w-12 translate-y-28 -rotate-90 rounded border border-black/30 bg-slate-200 text-slate-700 shadow sm:left-6 sm:-translate-y-3 sm:rotate-0"
        onClick={() => setShowOptions((prev) => !prev)}
      >
        <FiChevronsDown
          className={`mx-auto text-xl duration-300 ${
            showOptions && "-rotate-180"
          }`}
        />
      </button>
    </form>
  );
}
