import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useRef } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { showResultsAtom, showSearchOptionsAtom } from "../../utils/store";

interface Props {}

export default function SearchBar({}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setShowResults] = useAtom(showResultsAtom);
  const [, setShowSearchOptions] = useAtom(showSearchOptionsAtom);

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
    inputRef.current?.blur();

    const res = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(res[0]);

    router.replace({
      pathname: "map",
      query: { lat, lng },
    });
  }

  return (
    <div className="absolute top-4 z-10 w-full px-4 text-xl sm:top-6 sm:right-6 sm:w-96 sm:px-0">
      <Combobox
        value={value}
        onChange={(val) => handleChange(val)}
        disabled={!ready}
      >
        <div
          className={`relative flex w-full overflow-hidden rounded-lg bg-white px-3 py-2 shadow-lg ring-1 ring-black/20 ${
            !ready && "bg-slate-200"
          }`}
        >
          <Combobox.Input
            type="text"
            className="w-full outline-none"
            onChange={(e) => setValue(e.target.value)}
            placeholder={ready ? "Search city..." : "Loading..."}
            ref={inputRef}
            onFocus={() => {
              setShowResults(false);
              setShowSearchOptions(false);
            }}
          />
          <FiSearch className="text-2xl" />
        </div>
        <Transition
          enter="transition ease-in duration-100"
          enterFrom="transform -translate-y-5 opacity-0"
          enterTo="transform translate-y-0 opacity-100"
          leave="transition ease-in duration-100"
          leaveFrom="transform translate-y-0 opacity-100"
          leaveTo="transform -translate-y-5 opacity-0"
        >
          <Combobox.Options
            className="absolute mt-1 max-h-60 w-full transform divide-y divide-black/5 overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
            onClick={() => inputRef.current?.blur()}
          >
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
