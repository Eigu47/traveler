import { useAtom } from "jotai";

import MapCanvasMarker from "@/components/map/mapCanvas/MapCanvasMarker";
import {
  useGetIsShowFavorites,
  useGetShowFavoriteInMap,
} from "@/components/map/mapCanvas/MapCanvasUtil";
import { favoritesListAtom } from "@/utils/store";
import { useGetFavorites, useGetFavoritesId } from "@/utils/useQueryFavorites";
import { useGetFlatResults } from "@/utils/useQueryResults";

interface Props {}

export default function MapCanvasShowMarker({}: Props) {
  const [favoritesList] = useAtom(favoritesListAtom);
  const isShowFavorites = useGetIsShowFavorites();
  const { data: favoritesData, isSuccess: favoritesIsSuccess } =
    useGetFavorites();
  const favoritesId = useGetFavoritesId();
  const flatResults = useGetFlatResults();

  const showFavInMap = useGetShowFavoriteInMap();

  return (
    <>
      {flatResults
        .concat(favoritesList)
        .filter((result) => !favoritesId?.includes(result.place_id))
        .map((place) => (
          <MapCanvasMarker
            key={place.place_id}
            places={place}
            isFavorited={false}
          />
        ))}
      {(isShowFavorites || favoritesIsSuccess) &&
        favoritesData?.map((place) => (
          <MapCanvasMarker
            key={place.place_id}
            places={place}
            isFavorited={true}
          />
        ))}
      {showFavInMap && !favoritesId?.includes(showFavInMap.place_id) && (
        <MapCanvasMarker places={showFavInMap} isFavorited={false} />
      )}
    </>
  );
}
