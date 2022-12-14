import { SetStateAction } from "jotai";

import { Result } from "@/types/NearbySearchResult";

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

export function handleClickOnCard(
  mapRef: google.maps.Map | null,
  place: Result,
  setShowSearchOptions: (update: SetStateAction<boolean>) => void
) {
  if (!mapRef?.getBounds()?.contains(place.geometry.location)) {
    mapRef?.panTo(place.geometry.location);
  }

  setShowSearchOptions(false);
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
