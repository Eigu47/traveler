import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FavoritesData, Result } from "../types/NearbySearchResult";

export async function handleFavorite(
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

interface MutationProps {
  place: Result;
  isFavorited: boolean;
}

export function useAddFavorites(userId: string | null) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ place, isFavorited }: MutationProps) =>
      handleFavorite(place, isFavorited, userId),
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
          // Adding to fav case:
          if (!isFavorited) {
            queryClient.setQueryData<FavoritesData>(["favorites", userId], {
              ...prevData,
              favorites: [...prevData.favorites, place],
            });
          }
          // Removing from fav case:
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
