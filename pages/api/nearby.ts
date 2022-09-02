import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDistance } from "../../components/map/ResultsUtil";
import { NearbySearchResult, Result } from "../../types/NearbySearchResult";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pagetoken, lat, lng, radius, type, keyword } = req.query;

  try {
    const fetchRes = await axios.request<NearbySearchResult>({
      method: "GET",
      url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      params: {
        pagetoken,
        location: `${lat},${lng}`,
        radius,
        type,
        keyword,
        key: process.env.NEXT_PUBLIC_MAP_API_KEY,
      },
    });

    const filteredRes = fetchRes.data.results.filter(
      (res) => !res.types.includes("locality") && res.photos
    );

    const withDistanceRes = addDistance(filteredRes, lat, lng);

    res.status(200).json({ ...fetchRes.data, results: withDistanceRes });
  } catch (error) {
    res.status(500).json(error);
  }
}

export function addDistance(
  results: Result[],
  lat: string | string[] | undefined,
  lng: string | string[] | undefined
) {
  if (!(lat && lng && !isNaN(+lat) && !isNaN(+lng))) return results;

  const distanceAdded = results.map((res) => {
    const distance = getDistance(res.geometry.location, {
      lat: +lat,
      lng: +lng,
    });

    return {
      ...res,
      distance,
    };
  });

  return distanceAdded;
}
