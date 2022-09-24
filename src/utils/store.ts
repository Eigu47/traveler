import { atom } from "jotai";
import { SearchTypes, SortOptions } from "@/components/map/results/ResultsUtil";
import { Result } from "@/types/NearbySearchResult";

export const radiusAtom = atom(5000);

export const selectedPlaceAtom = atom<Result | undefined>(undefined);

export const clickedPlaceAtom = atom<string | undefined>(undefined);

export const showResultsAtom = atom(true);

export const showHamburgerAtom = atom(false);

export const keywordAtom = atom<string>("");

export const searchTypeAtom = atom<SearchTypes>("tourist_attraction");

export const sortByAtom = atom<SortOptions>("relevance");

export const showSearchOptionsAtom = atom(true);

export const favoritesListAtom = atom<Result[]>([]);

export const searchButtonAtom = atom<google.maps.LatLngLiteral | undefined>(
  undefined
);

export const mapRefAtom = atom<google.maps.Map | null>(null);

export const showFavInMapAtom = atom<Result | undefined>(undefined);
