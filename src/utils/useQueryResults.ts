import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { NearbySearchResult } from "../types/NearbySearchResult";
import { keywordAtom, radiusAtom, searchTypeAtom } from "./store";
import { useGetParams } from "@/components/map/MapCanvasUtil";

async function fetchResults(
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

export function useGetResults() {
  const [radius] = useAtom(radiusAtom);
  const [keyword] = useAtom(keywordAtom);
  const [searchType] = useAtom(searchTypeAtom);
  const { queryLatLng } = useGetParams();

  return useInfiniteQuery(
    ["nearby", queryLatLng],
    ({ pageParam = undefined }) =>
      fetchResults(queryLatLng, pageParam, radius, keyword, searchType),
    {
      enabled: !!queryLatLng,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      getNextPageParam: (lastPage) => {
        return lastPage?.next_page_token;
      },
    }
  );
}

export function useGetFlatResults() {
  const { data } = useGetResults();

  return useMemo(() => {
    return data?.pages.flatMap((pages) => pages?.results) ?? [];
  }, [data?.pages]);
}
