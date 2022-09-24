import Image from "next/image";
import { useGetResults } from "@/utils/useQueryResults";
import { showResultsAtom } from "@/utils/store";
import { useAtom } from "jotai";
import {
  useGetIsShowFavorites,
  useGetQueryLatLng,
} from "../mapCanvas/MapCanvasUtil";

interface Props {}

export default function ResultsText({}: Props) {
  const [showResults] = useAtom(showResultsAtom);
  const isShowFavorites = useGetIsShowFavorites();
  const queryLatLng = useGetQueryLatLng();

  const { isFetching, isFetchingNextPage, isError } = useGetResults();

  if (isError)
    return (
      <span
        className={`my-auto w-full text-center text-2xl transition-none duration-300 lg:translate-y-0 ${
          showResults ? "translate-y-0" : "translate-y-full"
        }`}
      >
        Something went wrong...
      </span>
    );

  if (isShowFavorites)
    return (
      <span
        className={`my-auto w-full text-center text-2xl transition-none duration-300 lg:translate-y-0 ${
          showResults ? "translate-y-0" : "translate-y-full"
        }`}
      >
        No favorites yet
      </span>
    );

  if (!isFetching && queryLatLng)
    return (
      <span
        className={`my-auto w-full text-center text-2xl transition-none duration-300 lg:translate-y-0 ${
          showResults ? "translate-y-0" : "translate-y-full"
        }`}
      >
        No results found
      </span>
    );

  if (isFetching && !isFetchingNextPage)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Image src="/loading.svg" alt="Loading..." height={150} width={150} />
      </div>
    );

  if (!isFetching && !queryLatLng)
    return (
      <div
        className={`my-auto w-full text-center text-2xl transition-none duration-300 lg:translate-y-0 ${
          showResults ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <span className="sm:hidden">Hold tap </span>
        <span className="hidden sm:block">Right click </span>
        in the map to start searching
      </div>
    );

  return null;
}

// return (
//   <>
//     {isFetching && !isFetchingNextPage && (
//       <div className="flex h-full w-full items-center justify-center">
//         <Image src="/loading.svg" alt="Loading..." height={150} width={150} />
//       </div>
//     )}

//     {!isFetching && queryLatLng && (
//       <span
//         className={`my-auto w-full text-center text-2xl transition-none duration-300 lg:translate-y-0 ${
//           showResults ? "translate-y-0" : "translate-y-full"
//         }`}
//       >
//         No results found
//       </span>
//     )}

//     {!isFetching && !isShowFavorites && !isError && !queryLatLng && (
//       <div
//         className={`my-auto w-full text-center text-2xl transition-none duration-300 lg:translate-y-0 ${
//           showResults ? "translate-y-0" : "translate-y-full"
//         }`}
//       >
//         <span className="sm:hidden">Hold tap </span>
//         <span className="hidden sm:block">Right click </span>
//         in the map to start searching
//       </div>
//     )}

//     {isShowFavorites && (
//       <span
//         className={`my-auto w-full text-center text-2xl transition-none duration-300 lg:translate-y-0 ${
//           showResults ? "translate-y-0" : "translate-y-full"
//         }`}
//       >
//         No favorites yet
//       </span>
//     )}

//     {isError && (
//       <span
//         className={`my-auto w-full text-center text-2xl transition-none duration-300 lg:translate-y-0 ${
//           showResults ? "translate-y-0" : "translate-y-full"
//         }`}
//       >
//         Something went wrong...
//       </span>
//     )}
//   </>
// );
