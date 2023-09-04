import GamesGridList from "@/components/GamesLists/GamesGridList/GamesGridList";
import RecommendationLists from "@/components/IndexPageContent/Recommendation/RecommendationLists";
import Layout from "@/components/Layout/Layout";
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="flex w-full justify-center">
      <script
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}`}
        async={true}
        crossOrigin="anonymous"
      />
      <div className="flex flex-col w-full lg:w-5/6">
        <RecommendationLists />
        <GamesGridList />
      </div>
    </div>
  );
};

export default Home;
