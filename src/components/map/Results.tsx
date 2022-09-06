import { useState, useMemo, useEffect } from "react";
import { SortOptions } from "./ResultsUtil";
import ResultsForm from "./ResultsForm";
import { useAtom } from "jotai";
import { favoritesListAtom, showResultsAtom } from "@/utils/store";
import { useRouter } from "next/router";
import ResultsList from "./ResultsList";
import ResultsChevronButton from "./ResultsChevronButton";
import ResultsText from "./ResultsText";
import { useGetResults } from "@/utils/useQueryResults";
import { useGetFavorites } from "@/utils/useQueryFavorites";

interface Props {}
export default function Results({}: Props) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortOptions>("relevance");
  const [showResults, setShowResults] = useAtom(showResultsAtom);
  const [favoritesList, setFavoritesList] = useAtom(favoritesListAtom);
  const [wasPrevFavorite, setWasPrevFavorite] = useState(false);

  const showFavorites = !!router.query.favs;
  const { response: favoriteRespose } = useGetFavorites();

  const queryLatLng: google.maps.LatLngLiteral | undefined = useMemo(() => {
    if (
      router.query.lat &&
      router.query.lng &&
      !isNaN(+router.query.lat) &&
      !isNaN(+router.query.lng)
    ) {
      return { lat: +router.query.lat, lng: +router.query.lng };
    }
  }, [router.query]);

  const {
    response: {
      refetch,
      isFetching,
      isFetchingNextPage,
      fetchNextPage,
      hasNextPage,
      isError,
    },
    flatResults,
  } = useGetResults(queryLatLng);

  useEffect(() => {
    if (showFavorites !== wasPrevFavorite) {
      setWasPrevFavorite(showFavorites);
    }
    if (showFavorites) {
      setFavoritesList(favoriteRespose?.data?.favorites ?? []);
      setShowResults(true);
    }
  }, [
    favoriteRespose,
    setShowResults,
    showFavorites,
    wasPrevFavorite,
    setFavoritesList,
  ]);

  return (
    <aside
      className={`absolute bottom-0 z-10 flex h-64 w-full flex-row bg-slate-300 ring-1 ring-black/50 duration-300 md:static md:h-full md:max-h-full md:min-w-[420px] md:max-w-[25vw] md:flex-col md:shadow-[0_10px_10px_5px_rgba(0,0,0,0.15)] md:ring-1 md:ring-black/20 md:transition-none 
      ${showResults ? "max-h-[256px]" : "max-h-[24px]"}
      `}
    >
      <ResultsForm
        refetch={refetch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        queryLatLng={queryLatLng}
      />
      {(!!flatResults.length || !!favoritesList.length) && (
        <ResultsList
          favoritesList={favoritesList}
          queryLatLng={queryLatLng}
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
          flatResults={flatResults}
          sortBy={sortBy}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        />
      )}
      <ResultsText
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        flatResults={flatResults}
        favoritesList={favoritesList}
        isError={isError}
        queryLatLng={queryLatLng}
        showResults={showResults}
      />
      <ResultsChevronButton />
    </aside>
  );
}
