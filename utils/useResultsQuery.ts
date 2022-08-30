import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { SetStateAction } from "jotai";
import { addDistance, SearchTypes } from "../components/map/ResultsUtil";
import { NearbySearchResult, Result } from "../types/NearbySearchResult";

export async function fetchResults(
  queryLatLng?: google.maps.LatLngLiteral,
  pageParam?: string,
  radius?: number,
  keyword?: string,
  type?: string
) {
  if (!queryLatLng) throw new Error("LatLng not found");

  const res = await axios.request({
    method: "GET",
    url: "/api/nearby",
    params: {
      pagetoken: pageParam,
      lat: queryLatLng.lat,
      lng: queryLatLng.lng,
      radius,
      type,
      keyword,
    },
  });

  return res.data as NearbySearchResult;
}

interface Props {
  queryLatLng: google.maps.LatLngLiteral | undefined;
  radius: number;
  keyword: string | undefined;
  type: SearchTypes;
  setAllResults: (update: SetStateAction<Result[]>) => void;
}

export function useGetResults({
  queryLatLng,
  radius,
  keyword,
  type,
  setAllResults,
}: Props) {
  return useInfiniteQuery(
    ["nearby", queryLatLng],
    ({ pageParam = undefined }) =>
      fetchResults(queryLatLng, pageParam, radius, keyword, type),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      getNextPageParam: (lastPage) => {
        return lastPage?.next_page_token;
      },
      onSuccess: (data) => {
        const allData = data.pages.flatMap((pages) => pages?.results);
        setAllResults(addDistance(allData, queryLatLng));
      },
    }
  );
}
