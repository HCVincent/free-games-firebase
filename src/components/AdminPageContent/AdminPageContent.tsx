import React from "react";
import GamesCrud from "./GamesCrud/GamesCrud";
import RecommendationsCrud from "./RecommendationsCrud/RecommendationsCrud";

type AdminPageContentProps = {
  selectedTab: string;
};

const AdminPageContent: React.FC<AdminPageContentProps> = ({ selectedTab }) => {
  return (
    <div className="w-full h-screen">
      {selectedTab === "games" && <GamesCrud />}
      {selectedTab === "recommendations" && <RecommendationsCrud />}
      {selectedTab === "users" && <>users</>}
    </div>
  );
};
export default AdminPageContent;
