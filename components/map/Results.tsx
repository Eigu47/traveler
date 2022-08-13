import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { nearbySearchResult } from "../../types/nearbySearchResult";
import ResultCard from "./ResultCard";

async function fetchResults(): Promise<nearbySearchResult> {
  return (await await fetch("dummyData.json")).json();
}

export default function Results() {
  const router = useRouter();
  const { data } = useQuery(["nearby"], fetchResults);

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
    <aside className="z-10 h-full w-2/6 bg-slate-300 shadow-[0_10px_10px_5px_rgba(0,0,0,0.15)] ring-1 ring-black/10">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex h-32 items-center space-x-3 bg-slate-200 p-3 shadow-md"
      >
        <div className="w-full">
          <input
            type="text"
            className="rounded px-2 outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Search by keyword"
          />
          <div>
            <label htmlFor="search-type" className="block text-xs">
              Filter by
            </label>
            <select id="search-type" className="block rounded text-sm">
              <option value="turist_attraction">Tourist attraction</option>
            </select>
          </div>
          <div>
            <label className="block text-xs" htmlFor="search-range">
              Range in meters:
            </label>
            <input
              className="range-sm block w-full cursor-pointer"
              id="search-range"
              type="range"
              placeholder="meters"
              defaultValue={1500}
              max={50000}
              min={1000}
              step={100}
            />
          </div>
        </div>
        <button
          type="submit"
          className="whitespace-nowrap rounded-md bg-blue-700 px-2 py-3 text-sm text-white shadow-md ring-1 ring-black/20 hover:bg-blue-800 active:scale-95"
        >
          Search here
        </button>
      </form>
      <div className="m-1.5 max-h-[calc(100vh-188px)] overflow-y-auto">
        {data?.results.map((place) => (
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
