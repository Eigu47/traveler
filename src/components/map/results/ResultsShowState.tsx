import { useGetQueryLatLng } from "@/components/map/mapCanvas/MapCanvasUtil";
import { useGetResults } from "@/utils/useQueryResults";

interface Props {}

export default function ResultsListShowState({}: Props) {
  const queryLatLng = useGetQueryLatLng();

  const { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetResults();

  return (
    <>
      {queryLatLng && (!isFetching || isFetchingNextPage) && (
        <div className="flex justify-center whitespace-nowrap py-2 px-2 text-xl lg:py-0">
          <button
            className={`w-full rounded-xl p-3 text-slate-100 shadow ring-1 ring-black/30  lg:p-6 ${
              hasNextPage
                ? "bg-blue-600 duration-100 hover:scale-[102%] hover:bg-blue-700 active:scale-[98%]"
                : "bg-blue-700/50"
            }`}
            onClick={() => {
              fetchNextPage();
            }}
            disabled={isFetchingNextPage || !hasNextPage}
          >
            {hasNextPage && !isFetchingNextPage && "Load more"}
            {hasNextPage && isFetchingNextPage && "Loading..."}
            {!hasNextPage && "No more results"}
          </button>
        </div>
      )}
    </>
  );
}
