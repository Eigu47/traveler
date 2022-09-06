import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MostFavoritesData } from "@/types/NearbySearchResult";

export function useGetMostFavorites() {
  const response = useQuery(
    ["most-favorites"],
    async () => {
      const res = await axios.get("/api/most-favorites");
      return res.data as MostFavoritesData[];
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  return response;
}
