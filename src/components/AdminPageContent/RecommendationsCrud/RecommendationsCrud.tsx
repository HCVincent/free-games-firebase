import AdminModal from "@/Modal/Admin/AdminModal";
import React, { useState } from "react";
import GamesRead from "./GamesRead";

const RecommendationsCrud: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="flex flex-col h-full p-4">
      {" "}
      <GamesRead />
    </div>
  );
};
export default RecommendationsCrud;
