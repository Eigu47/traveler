import { useQuery } from "@tanstack/react-query";
import { nearbySearchResult } from "../../types/nearbySearchResult";

interface Props {}

async function fetchResults(): Promise<nearbySearchResult> {
  return (await await fetch("dummyData.json")).json();
}

export default function Results({}: Props) {
  const { data } = useQuery(["nearby"], fetchResults);

  return (
    <aside className="z-10 h-full w-2/6 bg-slate-200 shadow-[0_10px_10px_10px_rgba(0,0,0,0.15)]">
      <h3>Results nearby</h3>
      {data?.results.map((place) => (
        <span key={place.place_id}>{place.name}</span>
      ))}
    </aside>
  );
}
