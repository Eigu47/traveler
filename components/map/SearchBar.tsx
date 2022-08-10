import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  return (
    <form className="absolute top-4 right-4 z-10 flex w-72 rounded-lg border bg-white px-3 py-2 shadow">
      <input
        type="text"
        className="grow text-sm outline-none "
        placeholder="Search city..."
      />
      <button
        type="submit"
        className="text-lg font-semibold text-gray-600 duration-75 ease-in-out"
      >
        <FiSearch />
      </button>
    </form>
  );
}
