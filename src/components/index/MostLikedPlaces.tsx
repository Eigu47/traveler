import { useState, useEffect, useRef } from "react";
import { useGetMostFavorites } from "@/utils/useQueryMostFavorites";
import MostLikedPlacesCard from "./MostLikedPlacesCard";
import { MostFavoritesData } from "@/types/NearbySearchResult";

interface Props {}

export default function MostLikedPlaces({}: Props) {
  const { data } = useGetMostFavorites();
  const didMount = useRef(false);
  const [staticFavData, setStaticFavData] = useState<MostFavoritesData[]>();

  useEffect(() => {
    if (!didMount.current && data) {
      setStaticFavData(data.slice(0, 6));
      didMount.current = true;
    }
  }, [data]);

  return (
    <>
      {data && (
        <div className="container mx-auto bg-slate-100 py-10 text-center">
          <h3 className="py-10 text-4xl">Most liked places</h3>
          <div className="container flex flex-wrap justify-center gap-6">
            {staticFavData &&
              staticFavData.map((staticFav) => (
                <MostLikedPlacesCard
                  key={staticFav.place.place_id}
                  staticFav={staticFav}
                  favTimes={
                    data.find(
                      (d) => d.place.place_id === staticFav.place.place_id
                    )?.favs
                  }
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
}
