import { useState } from "react";
import { SortOptions } from "./ResultsUtil";
import ResultsForm from "./ResultsForm";
import { useAtom } from "jotai";
import { showResultsAtom } from "@/utils/store";
import ResultsList from "./ResultsList";
import ResultsChevronButton from "./ResultsChevronButton";
import ResultsText from "./ResultsText";

interface Props {}

export default function Results({}: Props) {
  const [sortBy, setSortBy] = useState<SortOptions>("relevance");
  const [showResults] = useAtom(showResultsAtom);

  return (
    <aside
      className={`absolute bottom-0 z-10 flex h-64 w-full flex-row bg-slate-300 ring-1 ring-black/50 duration-300 md:static md:h-full md:max-h-full md:min-w-[420px] md:max-w-[25vw] md:flex-col md:shadow-[0_10px_10px_5px_rgba(0,0,0,0.15)] md:ring-1 md:ring-black/20 md:transition-none 
      ${showResults ? "max-h-[256px]" : "max-h-[24px]"}
      `}
    >
      <ResultsForm sortBy={sortBy} setSortBy={setSortBy} />
      <ResultsList sortBy={sortBy} />
      <ResultsText />
      <ResultsChevronButton />
    </aside>
  );
}
