import Hero from "../components/index/Hero";

const Home = ({ isLoaded }: { isLoaded: boolean }) => {
  return (
    <>
      <Hero isLoaded={isLoaded} />
      <div className="relative top-[100vh] h-screen bg-slate-200">
        <h3>Most liked places</h3>
      </div>
    </>
  );
};

export default Home;
