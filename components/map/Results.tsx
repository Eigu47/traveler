import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { SetStateAction, useState } from "react";
import { Dispatch, useMemo } from "react";
import { NearbySearchResult } from "../../types/NearbySearchResult";
import ResultCard from "./ResultCard";
import { FiChevronsDown } from "react-icons/fi";

interface Props {
  range: number;
  setRange: Dispatch<SetStateAction<number>>;
}

export default function Results({ range, setRange }: Props) {
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();

  const { data, isSuccess } = useQuery(["nearby"], fetchResults, {
    select: filterResults,
  });

  const queryLatLng = useMemo(() => {
    if (
      router.query.lat &&
      router.query.lng &&
      !isNaN(+router.query.lat) &&
      !isNaN(+router.query.lng)
    )
      return { lat: +router.query.lat, lng: +router.query.lng };
  }, [router.query]);

  return (
    <aside
      className="z-10 flex w-full
     max-w-[25vw] flex-col bg-slate-300 shadow-[0_10px_10px_5px_rgba(0,0,0,0.15)] ring-1 ring-black/10"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowOptions(false);
        }}
        className="bg-slate-200 px-4 shadow-md"
      >
        <div className="flex w-full items-center space-x-3 py-5">
          <div className="relative grow">
            <label
              htmlFor="search-keyword"
              className="absolute -top-4 left-1 text-xs"
            >
              Search by keyword:
            </label>
            <input
              type="text"
              id="search-keyboard"
              className="w-full rounded px-2 outline-none ring-1 ring-black/20 focus:ring-2 focus:ring-blue-500/50"
              placeholder="Optional"
              onFocus={() => setShowOptions(true)}
            />
          </div>
          <button className="h-fit whitespace-nowrap rounded-md bg-blue-700 px-4 py-3 text-sm text-white shadow-md ring-1 ring-black/20 hover:bg-blue-800 active:scale-95">
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
              <label htmlFor="search-type" className="block text-xs">
                Filter by
              </label>
              <select
                id="search-type"
                className="mb-3 w-full rounded text-sm outline-none focus:ring-1"
                defaultValue="tourist_attraction"
              >
                <option>Search all</option>
                {searchTypes.map((type) => (
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
              <label htmlFor="search-range" className="block text-xs">
                {`Range: ${range} meters`}
              </label>
              <input
                className="range-sm w-full cursor-pointer"
                id="search-range"
                type="range"
                value={range}
                onChange={(e) => setRange(+e.target.value)}
                max={50000}
                min={1000}
                step={100}
              />
            </div>
            <div className="grow">
              <label htmlFor="sort-by" className="block text-xs">
                Sort by
              </label>
              <select
                name="sort-by"
                id="sort-by"
                className="w-full rounded text-sm outline-none focus:ring-1"
                defaultValue="relevance"
              >
                {sortOptions.map((sort) => (
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
          className="absolute left-6 z-10 block h-5 w-10 -translate-y-3 rounded border border-black/30 bg-slate-200 text-slate-700 shadow"
          onClick={() => setShowOptions((prev) => !prev)}
        >
          <FiChevronsDown
            className={`mx-auto transition-all duration-300 ${
              showOptions && "-rotate-180"
            }`}
          />
        </button>
      </form>
      <div className="m-[8px_6px_8px_0px] space-y-5 overflow-y-auto">
        {isSuccess &&
          data?.results.map((place) => (
            <ResultCard
              key={place.place_id}
              place={place}
              queryLatLng={queryLatLng}
            />
          ))}
      </div>
    </aside>
  );
}

async function fetchResults(): Promise<NearbySearchResult> {
  const res = await fetch("dummyData.json");
  if (!res.ok) throw new Error("Network response was not ok");

  return res.json();
}

export function filterResults(data: NearbySearchResult) {
  const filterRes = data.results.filter(
    (res) => !res.types.includes("locality") && res.photos
  );

  return {
    ...data,
    results: filterRes,
  };
}

const sortOptions = ["relevance", "rating", "distance"];

const searchTypes = [
  "airport",
  "amusement_park",
  "aquarium",
  "art_gallery",
  "bar",
  "bus_station",
  "cafe",
  "campground",
  "casino",
  "department_store",
  "library",
  "lodging",
  "meal_delivery",
  "meal_takeaway",
  "movie_theater",
  "museum",
  "night_club",
  "park",
  "restaurant",
  "shopping_mall",
  "spa",
  "stadium",
  "store",
  "subway_station",
  "supermarket",
  "tourist_attraction",
  "train_station",
  "transit_station",
  "travel_agency",
];
