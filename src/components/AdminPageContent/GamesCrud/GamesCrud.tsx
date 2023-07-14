import AdminModal from "@/Modal/Admin/AdminModal";
import React, { useState } from "react";
import GamesRead from "./GamesRead";
type GamesCrudProps = {};

const GamesCrud: React.FC<GamesCrudProps> = () => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="flex flex-col h-full p-4">
      <AdminModal setSearchInput={setSearchInput} searchInput={searchInput} />
      <GamesRead />
    </div>
  );
};
export default GamesCrud;
