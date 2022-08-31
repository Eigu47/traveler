import {
  InfiniteData,
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { FiChevronsDown } from "react-icons/fi";
import { NearbySearchResult } from "../../types/NearbySearchResult";
import {
  SearchTypes,
  SEARCH_TYPES,
  SortOptions,
  SORT_OPTIONS,
} from "./ResultsUtil";
import { useAtom } from "jotai";
import {
  radiusAtom,
  clickedPlaceAtom,
  keywordAtom,
  queryLatLngAtom,
  searchTypeAtom,
  showResultsAtom,
  showSearchOptionsAtom,
} from "../../utils/store";

interface Props {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<InfiniteData<NearbySearchResult>, unknown>>;
  sortBy: SortOptions;
  setSortBy: Dispatch<SetStateAction<SortOptions>>;
}

export default function ResultsForm({ refetch, sortBy, setSortBy }: Props) {
  const [radius, setRadius] = useAtom(radiusAtom);
  const [, setClickedPlace] = useAtom(clickedPlaceAtom);
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const [queryLatLng] = useAtom(queryLatLngAtom);
  const [, setSearchType] = useAtom(searchTypeAtom);
  const [showSearchOptions, setShowSearchOptions] = useAtom(
    showSearchOptionsAtom
  );
  const [, setShowResults] = useAtom(showResultsAtom);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setShowSearchOptions(false);
        refetch();
        setShowResults(true);
        setClickedPlace(undefined);
      }}
      className={`fixed top-24 flex w-11/12 flex-col whitespace-nowrap rounded-xl bg-slate-200 px-3 pl-6 shadow-md ring-1 ring-black/10 duration-300 md:static md:block md:w-full md:translate-x-0 md:rounded-none md:px-4 md:transition-none ${
        showSearchOptions ? "-translate-x-4" : "-translate-x-[calc(100%-8px)]"
      }`}
    >
      <div className="flex w-full flex-col items-center justify-center space-x-3 space-y-3 overflow-hidden pt-6 pb-3 md:flex-row md:space-y-0 md:overflow-visible md:py-8">
        <div className="relative w-full">
          <label
            htmlFor="search-keyword"
            className="absolute -top-5 left-1 text-sm md:-top-6 md:text-base"
          >
            Search by keyword:
          </label>
          <input
            type="text"
            id="search-keyboard"
            className="w-full rounded px-2 py-1 text-xl outline-none ring-1 ring-black/20 focus:ring-2 focus:ring-blue-500/50 md:py-1"
            placeholder="Optional"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setShowSearchOptions(true)}
          />
        </div>
        <button
          className={`h-fit rounded-md bg-blue-700 px-12 py-3 text-white shadow-md ring-1 ring-black/20 md:px-4 ${
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
        className={`relative w-full overflow-hidden duration-300 ${
          showSearchOptions ? "md:max-h-[170px]" : "md:max-h-0"
        }`}
      >
        <div className="flex flex-col border-t border-t-black/20 py-4">
          <div className="flex space-x-4">
            <div className="w-4/6">
              <label
                htmlFor="search-type"
                className="block text-sm md:text-base"
              >
                Filter by
              </label>
              <select
                id="search-type"
                className="mb-3 w-full rounded text-lg outline-none focus:ring-1"
                defaultValue="tourist_attraction"
                onChange={(e) => setSearchType(e.target.value as SearchTypes)}
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
              <label htmlFor="sort-by" className="block text-sm md:text-base">
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
              className="block text-sm md:text-base"
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
        className="absolute -right-8 block h-12 w-12 translate-y-[108px] -rotate-90 rounded-full border border-black/30 bg-slate-200 text-slate-700 shadow md:left-6 md:h-6 md:-translate-y-3 md:rotate-0 md:rounded"
        onClick={() => setShowSearchOptions((prev) => !prev)}
      >
        <FiChevronsDown
          className={`mx-auto text-2xl duration-300 md:text-xl ${
            showSearchOptions && "-rotate-180"
          }`}
        />
      </button>
    </form>
  );
}
