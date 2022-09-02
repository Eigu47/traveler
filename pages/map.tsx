import MapCanvas from "../components/map/MapCanvas";
import Results from "../components/map/Results";
import Image from "next/image";
import { GetServerSideProps } from "next";
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  let queryLatLng: google.maps.LatLngLiteral | null = null;

  if (query.lat && query.lng && !isNaN(+query.lat) && !isNaN(+query.lng)) {
    queryLatLng = { lat: +query.lat, lng: +query.lng };
  }

  return {
    props: {
      showFavorites: !!query.favs,
      queryLatLng,
    },
  };
};
