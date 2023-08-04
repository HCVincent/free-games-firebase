import RecommendationLists from "@/components/IndexPageContent/Recommendation/RecommendationLists";
import Layout from "@/components/Layout/Layout";
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="flex w-full items-center">
      <Layout>
        <div className="flex flex-col w-full lg:w-5/6">
          <RecommendationLists />
        </div>
      </Layout>
    </div>
  );
};

export default Home;
