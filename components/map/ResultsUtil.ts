import axios from "axios";
import { NearbySearchResult } from "../../types/NearbySearchResult";

export async function fetchResults(
  queryLatLng?: google.maps.LatLngLiteral,
  radius?: number,
  keyword?: string,
  type?: string
) {
  if (!queryLatLng) return;
  const res = await axios.request({
    method: "GET",
    url: "/api/nearby",
    params: {
      lat: queryLatLng.lat,
      lng: queryLatLng.lng,
      radius,
      type,
      keyword,
      key: process.env.NEXT_PUBLIC_MAP_API_KEY,
    },
  });

  return res.data;
}

export function getDistance(
  pointA: google.maps.LatLngLiteral,
  pointB: google.maps.LatLngLiteral
) {
  const R = 6371;
  const dLat = (pointB.lat - pointA.lat) * (Math.PI / 180);
  const dLon = (pointB.lng - pointA.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(pointA.lat * (Math.PI / 180)) *
      Math.cos(pointB.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = Math.round(R * c * 100) / 100;
  return d;
}

export function filterResults(
  data: NearbySearchResult,
  queryLatLng?: google.maps.LatLngLiteral
) {
  const filteredResults = data.results.filter(
    (res) => !res.types.includes("locality") && res.photos
  );

  if (!queryLatLng) {
    return {
      ...data,
      results: filteredResults,
    };
  }

  const distanceAdded = filteredResults.map((res) => {
    const distance = getDistance(res.geometry.location, queryLatLng);

    return {
      ...res,
      distance,
    };
  });

  return {
    ...data,
    results: distanceAdded,
  };
}

export function sortResults(data: NearbySearchResult, sortBy: SortOptions) {
  if (sortBy === "rating") {
    return [...data.results]
      .sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0))
      .reverse();
  }

  if (sortBy === "distance") {
    return [...data.results].sort(
      (a, b) => (a.distance ?? 0) - (b.distance ?? 0)
    );
  }

  return data.results;
}

export type SearchTypes = typeof SEARCH_TYPES[number];

export type SortOptions = typeof SORT_OPTIONS[number];

export const SORT_OPTIONS = ["relevance", "rating", "distance"] as const;

export const SEARCH_TYPES = [
  "airport",
  "amusement_park",
  "aquarium",
  "art_gallery",
  "bar",
  "bus_station",
  "cafe",
  "campground",
  "casino",
  "department_store",
  "library",
  "lodging",
  "meal_delivery",
  "meal_takeaway",
  "movie_theater",
  "museum",
  "night_club",
  "park",
  "restaurant",
  "shopping_mall",
  "spa",
  "stadium",
  "store",
  "subway_station",
  "supermarket",
  "tourist_attraction",
  "train_station",
  "transit_station",
  "travel_agency",
] as const;
