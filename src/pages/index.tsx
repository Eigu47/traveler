import Hero from "@/components/index/Hero";
import { useGetFavorites } from "@/utils/useQueryFavorites";
import { useGetMostFavorites } from "@/utils/useQueryMostFavorites";

const Home = ({ isLoaded }: { isLoaded: boolean }) => {
  const { data: mostFavData } = useGetMostFavorites();

  const {
    response: { data: favData },
  } = useGetFavorites();

  return (
    <>
      <Hero isLoaded={isLoaded} />
      <div className="container mx-auto bg-slate-100 py-20 text-center">
        <h3 className="text-5xl">Most liked places</h3>
      </div>
    </>
  );
};

export default Home;
