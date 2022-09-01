import MapCanvas from "../components/map/MapCanvas";
import Results from "../components/map/Results";
import Image from "next/image";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { fetchResults, getFavorites } from "../utils/useQueryHooks";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

interface Props {
  isLoaded: boolean;
  queryLatLng: google.maps.LatLngLiteral;
  showFavorites: boolean;
}

export default function Map({ isLoaded, queryLatLng, showFavorites }: Props) {
  return (
    <main className="relative flex h-full max-w-full flex-row sm:top-14 sm:h-[calc(100%-56px)] md:h-[calc(100%-56px)]">
      <Results queryLatLng={queryLatLng} showFavorites={showFavorites} />
      {isLoaded ? (
        <MapCanvas queryLatLng={queryLatLng} showFavorites={showFavorites} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#e5e3df]">
          <Image src="/loading.svg" alt="Loading..." height={200} width={200} />
        </div>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  res,
}) => {
  const queryClient = new QueryClient();

  if (query.lat && query.lng && !isNaN(+query.lat) && !isNaN(+query.lng)) {
    const queryLatLng = { lat: +query.lat, lng: +query.lng };

    await queryClient.prefetchInfiniteQuery(
      ["nearby", queryLatLng],
      ({ pageParam = undefined }) => fetchResults(queryLatLng, pageParam),
      {
        getNextPageParam: (lastPage) => {
          return lastPage?.next_page_token;
        },
      }
    );
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        queryLatLng,
        showFavorites: null,
      },
    };
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (query.favs) {
    const userId = (session?.user as { _id: string | null })?._id;

    await queryClient.prefetchQuery(["favorites", userId], () =>
      getFavorites(userId)
    );
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        queryLatLng: null,
        showFavorites: true,
      },
    };
  }

  return {
    props: {
      queryLatLng: null,
      showFavorites: null,
    },
  };
};
