import AdminModal from "@/Modal/Admin/AdminModal";
import React, { useState } from "react";
import GamesRead from "./GamesRead";
import Update from "@/Modal/Admin/Update";
import useGames from "@/hooks/useGames";
type GamesCrudProps = {};

const GamesCrud: React.FC<GamesCrudProps> = () => {
  const [searchInput, setSearchInput] = useState("");
  const { gameStateValue } = useGames();
  return (
    <div className="flex flex-col h-full p-4">
      <AdminModal setSearchInput={setSearchInput} searchInput={searchInput} />
      <GamesRead />
      <dialog id="my_modal_2" className="modal" data-theme="dark">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg text-white">update</h3>
          {gameStateValue.selectedGame && (
            <div className="flex flex-col w-full">
              <Update game={gameStateValue.selectedGame} />
            </div>
          )}
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};
export default GamesCrud;
