import axios from "axios";
import { NearbySearchResult, Result } from "../../types/NearbySearchResult";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

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
      key: process.env.NEXT_PUBLIC_MAP_API_KEY,
    },
  });

  return res.data as NearbySearchResult;
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

export function addDistance(
  results: Result[],
  queryLatLng?: google.maps.LatLngLiteral
) {
  if (!queryLatLng) return results;

  const distanceAdded = results.map((res) => {
    const distance = getDistance(res.geometry.location, queryLatLng);

    return {
      ...res,
      distance,
    };
  });

  return distanceAdded;
}

export function sortResults(results: Result[], sortBy: SortOptions) {
  if (sortBy === "rating") {
    return [...results]
      .sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0))
      .reverse();
  }

  if (sortBy === "distance") {
    return [...results].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }

  return results;
}

export function Rating({
  rating,
  className = "",
}: {
  rating: number;
  className: string;
}) {
  return (
    <div className={`flex text-amber-400 ${className}`}>
      {rating < 1 ? <BsStarHalf /> : <BsStarFill />}
      {rating < 2 ? <BsStar /> : rating < 1.5 ? <BsStarHalf /> : <BsStarFill />}
      {rating < 3 ? <BsStar /> : rating < 3.5 ? <BsStarHalf /> : <BsStarFill />}
      {rating < 4 ? <BsStar /> : rating < 4.5 ? <BsStarHalf /> : <BsStarFill />}
      {rating < 5 ? (
        <BsStar />
      ) : rating < 4.75 ? (
        <BsStarHalf />
      ) : (
        <BsStarFill />
      )}
    </div>
  );
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
