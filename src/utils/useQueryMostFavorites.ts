import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useMostFavorites() {
  const response = useQuery(
    ["most-favorites"],
    async () => {
      const res = await axios.get("/api/most-favorites");
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  return response;
}
