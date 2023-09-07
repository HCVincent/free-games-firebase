import Footer from "@/components/Footer/Footer";
import GamesGridList from "@/components/GamesLists/GamesGridList/GamesGridList";
import RecommendationLists from "@/components/IndexPageContent/Recommendation/RecommendationLists";
import Layout from "@/components/Layout/Layout";
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col w-full justify-center lg:w-5/6">
        <RecommendationLists />
        <GamesGridList />
      </div>
    </div>
  );
};

export default Home;
