import usePlacesAutocomplete from "use-places-autocomplete";
import { Combobox, Transition } from "@headlessui/react";

import { FiSearch } from "react-icons/fi";
import { MdPlace } from "react-icons/md";
import { Fragment, useState } from "react";

const people = [
  { id: 1, name: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt" },
];

export default function SearchBar() {
  const [selectedPlace, setSelectedPlace] = useState("");
  const [query, setQuery] = useState("");

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="absolute top-4 right-4 z-10 w-72 text-sm">
      <Combobox value={selectedPlace} onChange={setSelectedPlace}>
        <form className="relative flex w-full overflow-hidden rounded-lg bg-white px-3 py-2 shadow-lg ring-1 ring-black ring-opacity-5">
          <Combobox.Input
            className="w-full outline-none"
            onChange={(e: any) => setQuery(e.target.value)}
          />
          <button type="submit" className="text-xl">
            <FiSearch />
          </button>
        </form>
        <Transition
          enter="transition ease-in duration-100"
          enterFrom="transform -translate-y-5 opacity-0"
          enterTo="transform translate-y-0 opacity-100"
          leave="transition ease-in duration-100"
          leaveFrom="transform translate-y-0 opacity-100"
          leaveTo="transform -translate-y-5 opacity-0"
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full transform divide-y divide-black/5 overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            {filteredPeople.length === 0 && query !== "" && (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            )}
            {filteredPeople.map((person) => (
              <Combobox.Option
                key={person.id}
                value={person}
                className={({ active }) =>
                  `cursor-default select-none py-1 px-3 ${
                    active ? "bg-sky-600 text-white" : "text-gray-900"
                  }`
                }
              >
                <span>{person.name}</span>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
}
