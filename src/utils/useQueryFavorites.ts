import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FavoritesData, Result } from "@/types/NearbySearchResult";

export async function getFavorites(userId: string | null) {
  if (!userId) throw new Error("Not logged");

  const res = await axios.request({
    method: "GET",
    url: "/api/favorites",
    params: { userId },
  });

  return res.data as FavoritesData;
}

export function useGetFavorites() {
  const { data: session } = useSession();
  const userId = (session?.user as { _id: string | null })?._id;

  const response = useQuery(["favorites", userId], () => getFavorites(userId), {
    enabled: !!userId,
  });

  const favoritesId = useMemo(
    () => response?.data?.favorites?.flatMap((fav) => fav.place_id),
    [response?.data?.favorites]
  );

  return {
    response,
    favoritesId,
  };
}

export async function handleFavorites(
  place: Result,
  isFavorited: boolean,
  userId: string | null
) {
  if (!userId) throw new Error("Not logged");

  if (!isFavorited) {
    const res = await axios.request({
      method: "POST",
      url: "/api/favorites",
      data: {
        place,
        userId,
      },
    });

    return res;
  }

  if (isFavorited) {
    const res = await axios.request({
      method: "DELETE",
      url: "/api/favorites",
      data: {
        place_id: place.place_id,
        userId,
      },
    });

    return res;
  }
}

interface Props {
  place: Result;
  isFavorited: boolean;
}

export function useFavorites() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = (session?.user as { _id: string | null })?._id;
  // Optimistic update
  return useMutation(
    ({ place, isFavorited }: Props) =>
      handleFavorites(place, isFavorited, userId),
    {
      // When mutate is called, props from mutate(props):
      onMutate: async ({ place, isFavorited }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["favorites", userId]);
        // Snapshot the previous value
        const prevData = queryClient.getQueryData<FavoritesData>([
          "favorites",
          userId,
        ]);
        // Optimistically update to the new value
        if (prevData?.favorites) {
          // Adding case:
          if (!isFavorited) {
            queryClient.setQueryData<FavoritesData>(["favorites", userId], {
              ...prevData,
              favorites: [...prevData.favorites, place],
            });
          }
          // Removing case:
          if (isFavorited) {
            queryClient.setQueryData<FavoritesData>(["favorites", userId], {
              ...prevData,
              favorites: [
                ...prevData.favorites.filter((prev) => prev !== place),
              ],
            });
          }
        }
        // Return a context with the previous and new todo
        return { prevData };
      },
      // If the mutation fails, use the context we returned above
      onError: (_err, _variables, context) => {
        if (context?.prevData) {
          queryClient.setQueriesData<FavoritesData>(
            ["favorites", userId],
            context.prevData
          );
        }
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(["favorites", userId]);
      },
    }
  );
}