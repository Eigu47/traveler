import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { NearbySearchResult } from "../../types/NearbySearchResult";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lat, lng, radius, type, keyword } = req.query;

  try {
    const fetchRes = await axios.request<NearbySearchResult>({
      method: "GET",
      url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      params: {
        location: `${lat},${lng}`,
        radius,
        type,
        keyword,
        key: process.env.NEXT_PUBLIC_MAP_API_KEY,
      },
    });

    const filterRes = fetchRes.data.results.filter(
      (res) => !res.types.includes("locality") && res.photos
    );

    const response = {
      ...fetchRes.data,
      results: filterRes,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
}
