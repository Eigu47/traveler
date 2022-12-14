import { useAtom } from "jotai";
import { FiChevronDown } from "react-icons/fi";

import { showResultsAtom } from "@/utils/store";

interface Props {}

export default function ResultsChevronButton({}: Props) {
  const [showResults, setShowResults] = useAtom(showResultsAtom);

  return (
    <div
      className={`fixed bottom-[250px] w-screen duration-300 lg:hidden lg:animate-none ${
        showResults ? "translate-y-0" : "translate-y-60"
      }`}
      onClick={() => setShowResults((prev) => !prev)}
    >
      <button
        type="button"
        data-test-id="results-button"
        className="mx-auto block w-2/6 rounded-md bg-gray-300 text-slate-700 shadow ring-1 ring-black/20"
      >
        <FiChevronDown
          className={`mx-auto text-2xl duration-300 lg:text-xl ${
            showResults ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>
    </div>
  );
}
