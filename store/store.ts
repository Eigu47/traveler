import { atom } from "jotai";
import { Result } from "../types/NearbySearchResult";

export const radiusAtom = atom(5000);

export const selectedPlaceAtom = atom<Result | undefined>(undefined);

export const clickedPlaceAtom = atom("");

export const searchbarOnFocusAtom = atom(false);

export const showResultsAtom = atom(false);
