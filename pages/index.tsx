import Hero from "../components/index/Hero";
import { useGetFavorites } from "./../utils/useQueryHooks";

const Home = ({ isLoaded }: { isLoaded: boolean }) => {
  const { response } = useGetFavorites();

  return (
    <>
      <Hero isLoaded={isLoaded} />
    </>
  );
};

export default Home;
