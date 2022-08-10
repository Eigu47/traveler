import Map from "../components/map/Map";
import Results from "../components/map/Results";
import SearchBar from "../components/map/SearchBar";

export default function map() {
  return (
    <main className="relative top-12 flex h-[calc(100vh-48px)] max-h-full max-w-full">
      <Results />
      <Map />
      <SearchBar />
    </main>
  );
}
