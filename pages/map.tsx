import MapCanvas from "../components/map/MapCanvas";
import Results from "../components/map/Results";
import { useState } from "react";

export default function Map() {
  const [range, setRange] = useState<number>(1500);

  return (
    <main className="relative top-12 flex h-[calc(100vh-48px)] max-h-full max-w-full">
      <Results range={range} setRange={setRange} />
      <MapCanvas range={range} />
    </main>
  );
}
