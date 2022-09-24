import { favoritesListAtom, sortByAtom } from "@/utils/store";
import { useGetFlatResults, useGetResults } from "@/utils/useQueryResults";
import { useAtom } from "jotai";
import {
  useGetIsShowFavorites,
  useGetQueryLatLng,
  useGetShowFavoriteInMap,
} from "../mapCanvas/MapCanvasUtil";
import ResultsCard from "./ResultsCard";
import { sortResults } from "./ResultsUtil";

interface Props {}

export default function ResultsListShowCard({}: Props) {
  const [favoritesList] = useAtom(favoritesListAtom);
  const [sortBy] = useAtom(sortByAtom);

  const queryLatLng = useGetQueryLatLng();
  const flatResults = useGetFlatResults();
  const isShowFavorites = useGetIsShowFavorites();

  const showFavInMap = useGetShowFavoriteInMap();

  const isFav = favoritesList.some(
    (fav) => fav.place_id === showFavInMap?.place_id
  );

  return (
    <>
      {favoritesList.map((place) => (
        <ResultsCard
          key={place.place_id}
          place={place}
          queryLatLng={queryLatLng}
        />
      ))}

      {sortResults(flatResults, sortBy).map((place) => (
        <ResultsCard
          key={place.place_id}
          place={place}
          queryLatLng={queryLatLng}
        />
      ))}

      {showFavInMap && !queryLatLng && !isShowFavorites && !isFav && (
        <ResultsCard place={showFavInMap} />
      )}
    </>
  );
}
