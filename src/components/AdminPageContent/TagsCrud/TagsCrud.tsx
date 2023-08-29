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
      <div className="flex ">
        {gameStateValue.gameTag.map((tag) => (
          <TagCard tag={tag} key={tag.id}></TagCard>
        ))}
      </div>
    </div>
  );
};
export default TagsCrud;
