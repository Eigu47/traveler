import { useAtom } from "jotai";
import { FiChevronsDown } from "react-icons/fi";

import { useGetQueryLatLng } from "@/components/map/mapCanvas/MapCanvasUtil";
import {
  SearchTypes,
  SEARCH_TYPES,
  SortOptions,
  SORT_OPTIONS,
} from "@/components/map/results/ResultsUtil";
import {
  clickedPlaceAtom,
  favoritesListAtom,
  keywordAtom,
  radiusAtom,
  searchTypeAtom,
  showResultsAtom,
  showSearchOptionsAtom,
  sortByAtom,
} from "@/utils/store";
import { useGetResults } from "@/utils/useQueryResults";

interface Props {}

export default function ResultsForm({}: Props) {
  const [radius, setRadius] = useAtom(radiusAtom);
  const [, setClickedPlace] = useAtom(clickedPlaceAtom);
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const [, setSearchType] = useAtom(searchTypeAtom);
  const [showSearchOptions, setShowSearchOptions] = useAtom(
    showSearchOptionsAtom
  );
  const [, setShowResults] = useAtom(showResultsAtom);
  const [, setFavoritesList] = useAtom(favoritesListAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);

  const queryLatLng = useGetQueryLatLng();
  const { refetch } = useGetResults();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setShowSearchOptions(false);
        refetch();
        setFavoritesList([]);
        setShowResults(true);
        setClickedPlace(undefined);
      }}
      className={`fixed top-24 flex w-11/12 max-w-xl flex-col whitespace-nowrap rounded-xl bg-slate-200 px-3 pl-6 shadow-md ring-1 ring-black/10 duration-300 sm:top-44 lg:static lg:block lg:w-full lg:translate-x-0 lg:rounded-none lg:px-4 lg:transition-none 2xl:max-w-full ${
        showSearchOptions ? "-translate-x-4" : "-translate-x-[calc(100%-8px)]"
      }`}
    >
      <div className="flex w-full flex-col items-center justify-center space-x-3 space-y-3 overflow-hidden px-0.5 pt-6 pb-3 lg:flex-row lg:space-y-0 lg:overflow-visible lg:py-8">
        <div className="relative w-full">
          <label
            htmlFor="search-keyword"
            className="absolute -top-5 left-1 text-sm lg:-top-6 lg:text-base"
          >
            Search by keyword:
          </label>
          <input
            type="text"
            id="search-keyboard"
            className="w-full rounded px-2 py-1 text-xl outline-none ring-1 ring-black/20 focus:ring-2 focus:ring-blue-500/50 lg:py-1"
            placeholder="Optional"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setShowSearchOptions(true)}
          />
        </div>
        <button
          className={`h-fit rounded-md bg-blue-700 px-12 py-3 text-white shadow-md ring-1 ring-black/20 lg:px-4 ${
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
        className={`relative w-full overflow-hidden px-0.5 duration-300 ${
          showSearchOptions ? "lg:max-h-[170px]" : "lg:max-h-0"
        }`}
      >
        <div className="flex flex-col border-t border-t-black/20 py-4">
          <div className="flex space-x-4">
            <div className="w-4/6">
              <label
                htmlFor="search-type"
                className="block text-sm lg:text-base"
              >
                Filter by
              </label>
              <select
                id="search-type"
                className="mb-3 w-full rounded text-lg outline-none ring-1 ring-black/20 focus:ring-2 focus:ring-blue-500/50"
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
              <label htmlFor="sort-by" className="block text-sm lg:text-base">
                Sort by
              </label>
              <select
                name="sort-by"
                id="sort-by"
                className="w-full rounded text-lg outline-none ring-1 ring-black/20 focus:ring-2 focus:ring-blue-500/50"
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
          <div>
            <label
              htmlFor="search-radius"
              className="block text-sm lg:text-base"
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
        data-test-id="search-options-button"
        className="absolute -right-8 block h-12 w-12 translate-y-[108px] -rotate-90 rounded-full border border-black/30 bg-slate-200 text-slate-700 shadow lg:left-6 lg:h-6 lg:-translate-y-3 lg:rotate-0 lg:rounded"
        onClick={() => setShowSearchOptions((prev) => !prev)}
      >
        <FiChevronsDown
          className={`mx-auto text-2xl duration-300 lg:text-xl ${
            showSearchOptions && "-rotate-180"
          }`}
        />
      </button>
    </form>
  );
}
