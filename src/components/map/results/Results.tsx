import { useAtom } from "jotai";

import { useGetShowFavoriteInMap } from "@/components/map/mapCanvas/MapCanvasUtil";
import ResultsChevronButton from "@/components/map/results/ResultsChevronButton";
import ResultsForm from "@/components/map/results/ResultsForm";
import ResultsShowCards from "@/components/map/results/ResultsShowCards";
import ResultsListShowState from "@/components/map/results/ResultsShowState";
import ResultsText from "@/components/map/results/ResultsText";
import { favoritesListAtom, showResultsAtom } from "@/utils/store";
import { useGetFlatResults } from "@/utils/useQueryResults";

interface Props {}

export default function Results({}: Props) {
  const [showResults] = useAtom(showResultsAtom);
  const [favoritesList] = useAtom(favoritesListAtom);

  const flatResults = useGetFlatResults();
  const showFavInMap = useGetShowFavoriteInMap();

  const isResults =
    !!flatResults.length || !!favoritesList.length || !!showFavInMap;

  return (
    <aside className="z-10 flex flex-row bg-slate-300 lg:flex-col lg:shadow-[0_10px_10px_5px_rgba(0,0,0,0.15)] lg:ring-1 lg:ring-black/20">
      <ResultsForm />
      <div
        className={`fixed bottom-0 flex h-[260px] w-full flex-row overflow-visible overflow-x-auto overflow-y-hidden bg-slate-300 pt-3 shadow-lg ring-1 ring-black/20 duration-300 lg:static lg:m-[12px_8px_12px_4px] lg:h-full lg:max-h-full lg:w-auto lg:min-w-[450px] lg:max-w-[25vw] lg:translate-y-0 lg:animate-none lg:flex-col lg:space-y-5 lg:overflow-y-auto lg:py-2 lg:shadow-none lg:ring-0 ${
          showResults ? "translate-y-0" : "translate-y-60"
        }`}
      >
        {isResults && (
          <>
            <ResultsShowCards />
            <ResultsListShowState />
          </>
        )}
        {!isResults && <ResultsText />}
      </div>
      <ResultsChevronButton />
    </aside>
  );
}
