import MapCanvas from "@/components/map/MapCanvas";
import Results from "@/components/map/Results";
import Image from "next/image";

interface Props {
  googleMapScriptIsLoaded: boolean;
}

export default function Map({ googleMapScriptIsLoaded }: Props) {
  return (
    <main className="relative flex h-full max-w-full flex-row overflow-hidden sm:top-14 sm:h-[calc(100%-56px)] md:h-[calc(100%-56px)]">
      <Results />
      {googleMapScriptIsLoaded && <MapCanvas />}
      {!googleMapScriptIsLoaded && (
        <div className="flex h-full w-full items-center justify-center bg-[#e5e3df]">
          <Image src="/loading.svg" alt="Loading..." height={200} width={200} />
        </div>
      )}
    </main>
  );
}

// Prefetching data on the server side
// import { GetServerSideProps } from "next";
// import { dehydrate, QueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { NearbySearchResult } from "../types/NearbySearchResult";
// import { unstable_getServerSession } from "next-auth";
// import { authOptions } from "./api/auth/[...nextauth]";
// import clientPromise from "../utils/mongodb";
// import { ObjectId } from "mongodb";

// export const getServerSideProps: GetServerSideProps = async ({
//   query,
//   req,
//   res,
// }) => {
//   let queryLatLng: google.maps.LatLngLiteral | null = null;
//   const queryClient = new QueryClient();

//   if (query.lat && query.lng && !isNaN(+query.lat) && !isNaN(+query.lng)) {
//     queryLatLng = { lat: +query.lat, lng: +query.lng };

//     await queryClient.prefetchInfiniteQuery(
//       ["nearby", queryLatLng],
//       async ({ pageParam = undefined }) => {
//         const fetchRes = await axios.request<NearbySearchResult>({
//           method: "GET",
//           url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
//           params: {
//             pagetoken: pageParam,
//             location: `${queryLatLng!.lat},${queryLatLng!.lng}`,
//             radius: query.radius ?? 5000,
//             type: query.type ?? "tourist_attraction",
//             keyword: query.keyword,
//             key: process.env.NEXT_PUBLIC_MAP_API_KEY,
//           },
//         });

//         const filteredRes = fetchRes.data.results.filter(
//           (res) => !res.types.includes("locality") && res.photos
//         );

//         return { ...fetchRes.data, results: filteredRes };
//       },
//       {
//         getNextPageParam: (lastPage) => {
//           return lastPage?.next_page_token;
//         },
//       }
//     );
//   }

//   const session = await unstable_getServerSession(req, res, authOptions);
//   const userId = (session?.user as { _id: string | null })?._id;

//   if (userId) {
//     await queryClient.prefetchQuery(["favorites", userId], async () => {
//       const data = (await clientPromise).db().collection("users");

//       const response = await data.findOne(
//         { _id: new ObjectId(userId) },
//         { projection: { favorites: 1 } }
//       );

//       return response;
//     });
//   }

//   return {
//     props: {
//       dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
//       showFavorites: !!query.favs,
//       queryLatLng,
//     },
//   };
// };
