import { useQuery } from "@tanstack/react-query";
import { nearbySearchResult } from "../../types/nearbySearchResult";
import ResultCard from "./ResultCard";

interface Props {}

async function fetchResults(): Promise<nearbySearchResult> {
  return (await await fetch("dummyData.json")).json();
}

export default function Results({}: Props) {
  const { data } = useQuery(["nearby"], fetchResults);

  return (
    <aside className="z-10 h-full w-2/6 bg-slate-300 shadow-[0_10px_10px_5px_rgba(0,0,0,0.15)] ring-1 ring-black/10">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex h-32 items-center space-x-3 bg-slate-200 p-3 shadow-md"
      >
        <div className="w-full space-y-3">
          <div className="">
            <label htmlFor="search-type" className="block text-xs">
              Search by
            </label>
            <select
              id="search-type"
              className="w-full rounded-md border-black py-1"
            >
              <option value="turist_attraction">Tourist attraction</option>
            </select>
          </div>
          <div className="">
            <label className="block text-xs" htmlFor="search-range">
              Range in meters:
            </label>
            <input
              className="w-full cursor-pointer bg-gray-200"
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
          className="whitespace-nowrap rounded-md bg-blue-700 px-2 py-3 text-sm text-white shadow-md ring-1 ring-black/20 hover:bg-blue-800"
        >
          Search here
        </button>
      </form>
      <div className="m-1.5 max-h-[calc(100vh-188px)] overflow-y-auto">
        {data?.results.map((place) => (
          <ResultCard key={place.place_id} place={place} />
        ))}
      </div>
    </aside>
  );
}
