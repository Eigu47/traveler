import { atom } from "jotai";
import { SearchTypes } from "../components/map/ResultsUtil";
import { Result } from "../types/NearbySearchResult";

export const radiusAtom = atom(5000);

export const selectedPlaceAtom = atom<Result | undefined>(undefined);

export const clickedPlaceAtom = atom<string | undefined>(undefined);

export const searchbarOnFocusAtom = atom(false);

export const showResultsAtom = atom(false);

export const showHamburgerAtom = atom(false);

export const keywordAtom = atom<string | undefined>(undefined);

export const searchTypeAtom = atom<SearchTypes>("tourist_attraction");

export const showSearchOptionsAtom = atom(true);

export const allResultsAtom = atom<Result[]>([]);

export const queryLatLngAtom = atom<google.maps.LatLngLiteral | undefined>(
  undefined
);
