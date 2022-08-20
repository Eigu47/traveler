import Hero from "../components/index/Hero";

const Home = ({ isLoaded }: { isLoaded: boolean }) => {
  return (
    <>
      <Hero isLoaded={isLoaded} />
    </>
  );
};

export default Home;
