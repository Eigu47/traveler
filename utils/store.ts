import { atom } from "jotai";
import { Result } from "../types/NearbySearchResult";

export const radiusAtom = atom(5000);

export const selectedPlaceAtom = atom<Result | undefined>(undefined);

export const clickedPlaceAtom = atom<string | undefined>(undefined);

export const searchbarOnFocusAtom = atom(false);

export const showResultsAtom = atom(false);

export const showHamburgerAtom = atom(false);

export const allResultsAtom = atom<Result[]>([]);

export const queryLatLngAtom = atom<google.maps.LatLngLiteral | undefined>(
  undefined
);

export const favoritesIdAtom = atom<string[] | undefined>([]);
