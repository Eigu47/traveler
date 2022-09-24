import ResultsForm from "./ResultsForm";
import { useAtom } from "jotai";
import { favoritesListAtom, showResultsAtom } from "@/utils/store";
import ResultsChevronButton from "./ResultsChevronButton";
import ResultsText from "./ResultsText";
import { useGetFlatResults } from "@/utils/useQueryResults";
import ResultsShowCards from "./ResultsShowCards";
import ResultsShowState from "./ResultsShowState";
import { useGetShowFavoriteInMap } from "../mapCanvas/MapCanvasUtil";

interface Props {}

export default function Results({}: Props) {
  const [showResults] = useAtom(showResultsAtom);
  const [favoritesList] = useAtom(favoritesListAtom);

  const flatResults = useGetFlatResults();
  const showFavInMap = useGetShowFavoriteInMap();

  const isResults =
    !!flatResults.length || !!favoritesList.length || !!showFavInMap;

  return (
    <aside
      className={`absolute bottom-0 z-10 flex h-64 w-full flex-row bg-slate-300 ring-1 ring-black/50 duration-300 lg:static lg:h-full lg:max-h-full lg:min-w-[450px] lg:max-w-[25vw] lg:flex-col lg:shadow-[0_10px_10px_5px_rgba(0,0,0,0.15)] lg:ring-1 lg:ring-black/20 lg:transition-none 
      ${showResults ? "max-h-[256px]" : "max-h-[24px]"}
      `}
    >
      <ResultsForm />
      {isResults && (
        <div className="mx-1 flex w-full flex-row overflow-x-auto overflow-y-hidden pt-3 lg:m-[12px_8px_12px_4px] lg:w-auto lg:flex-col lg:space-y-5 lg:overflow-y-auto lg:overflow-x-hidden lg:py-2">
          <ResultsShowCards />
          <ResultsShowState />
        </div>
      )}
      {!isResults && <ResultsText />}
      <ResultsChevronButton />
    </aside>
  );
}
