import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Combobox, Transition } from "@headlessui/react";

import { FiSearch } from "react-icons/fi";
import { ChangeEvent } from "react";
import { useRouter } from "next/router";

export default function SearchBar() {
  const router = useRouter();

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  async function handleChange(val: string) {
    if (!val) return;

    setValue(val, false);
    clearSuggestions();

    const res = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(res[0]);

    router.replace({
      pathname: "map",
      query: { lat, lng },
    });
  }

  return (
    <div className="absolute top-4 right-4 z-10 w-72 text-sm">
      <Combobox value={value} onChange={handleChange} disabled={!ready}>
        <div
          className={`relative flex w-full overflow-hidden rounded-lg bg-white px-3 py-2 shadow-lg ring-1 ring-black ring-opacity-5 ${
            !ready && "bg-slate-200"
          }`}
        >
          <Combobox.Input
            className="w-full outline-none"
            displayValue={(value: string) => value}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
            placeholder={ready ? "Search city..." : "Loading..."}
          />
          <FiSearch className="text-xl" />
        </div>
        <Transition
          enter="transition ease-in duration-100"
          enterFrom="transform -translate-y-5 opacity-0"
          enterTo="transform translate-y-0 opacity-100"
          leave="transition ease-in duration-100"
          leaveFrom="transform translate-y-0 opacity-100"
          leaveTo="transform -translate-y-5 opacity-0"
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full transform divide-y divide-black/5 overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            {status === "OK" &&
              data.map((place) => (
                <Combobox.Option
                  key={place.place_id}
                  value={place.description}
                  className={({ active }) =>
                    `cursor-default select-none py-1 px-3 ${
                      active ? "bg-sky-600 text-white" : "text-gray-900"
                    }`
                  }
                >
                  <span>{place.description}</span>
                </Combobox.Option>
              ))}
            {(status === "ZERO_RESULTS" || !status) && (
              <div className="relative cursor-default select-none py-1 px-4 text-gray-700">
                Nothing found.
              </div>
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
}
