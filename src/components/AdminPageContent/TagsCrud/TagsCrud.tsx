import AdminModal from "@/Modal/Admin/AdminModal";
import TagCard from "@/components/TagCard/TagCard";
import useGames from "@/hooks/useGames";
import React, { useState } from "react";
// import GamesRead from "./GamesRead";

const TagsCrud: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const { onSelectGame, gameStateValue, setGameStateValue } = useGames();
  return (
    <div className="flex flex-col h-full p-4">
      <AdminModal setSearchInput={setSearchInput} searchInput={searchInput} />
      <div className="flex flex-col items-center h-full justify-between lg:grid lg:grid-cols-5 lg:gap-4 lg:mt-4">
        {gameStateValue.gameTag.map((tag) => (
          <TagCard tag={tag} key={tag.id}></TagCard>
        ))}
      </div>
    </div>
  );
};
export default TagsCrud;
