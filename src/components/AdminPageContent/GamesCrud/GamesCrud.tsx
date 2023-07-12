import AdminModal from "@/Modal/Admin/AdminModal";
import React from "react";
import GamesRead from "./GamesRead";
type GamesCrudProps = {};

const GamesCrud: React.FC<GamesCrudProps> = () => {
  return (
    <div className="flex flex-col h-full p-4">
      <AdminModal />
      <GamesRead />
    </div>
  );
};
export default GamesCrud;
