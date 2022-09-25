import AboutFooter from "@/components/index/AboutFooter";
import Hero from "@/components/index/Hero";
import MostLikedPlaces from "@/components/index/MostLikedPlaces";

interface Props {
  googleMapScriptIsLoaded: boolean;
}

const Home = ({ googleMapScriptIsLoaded }: Props) => {
  return (
    <>
      <Hero googleMapScriptIsLoaded={googleMapScriptIsLoaded} />
      <MostLikedPlaces />
      <AboutFooter />
    </>
  );
};

export default Home;
