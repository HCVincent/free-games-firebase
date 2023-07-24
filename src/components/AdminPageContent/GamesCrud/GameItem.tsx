import Update from "@/Modal/Admin/Update";
import { adminModalState } from "@/atoms/adminModalAtom";
import { Game } from "@/atoms/gamesAtom";
import useGames from "@/hooks/useGames";
import { Image } from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import default_cover from "../../../../public/default_cover.png";

type GameItemProps = {
  game: Game;
};

const GameItem: React.FC<GameItemProps> = ({ game }) => {
  const { onDeleteGame, onSelectGame, gameStateValue } = useGames();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const handleDelete = () => {
    setDeleteLoading(true);
    onDeleteGame(game);
    setDeleteLoading(false);
  };
  return (
    <div className="flex ">
      <div className="card w-56 bg-base-100 shadow-xl">
        <figure className="h-full">
          <div className="flex w-full h-24 items-start justify-start">
            {imageLoading && (
              <div className="flex w-full h-full items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            )}
            <Image
              alt={game.title}
              src={game.coverImage ? game.coverImage : default_cover.src}
              display={imageLoading ? "none" : "unset"}
              className="w-full object-cover rounded-lg "
              onLoad={() => setImageLoading(false)}
            />
          </div>
        </figure>
        <div className="card-body w-full p-2">
          <h2>{game.title}</h2>
          {game.createdAt && (
            <span className="text-xs text-slate-700">
              {moment(new Date(game.createdAt?.seconds * 1000)).fromNow()}
            </span>
          )}
          <div className="card-actions w-full justify-between ">
            <button
              className="btn"
              //@ts-ignore
              onClick={() => {
                if (document) {
                  onSelectGame(game);
                  (
                    document.getElementById("my_modal_2") as HTMLFormElement
                  ).showModal();
                }
              }}
            >
              UPDATE
            </button>

            {deleteLoading ? (
              <div className="flex w-full h-full items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <button
                className="btn btn-ghost flex-1 text-sm p-0"
                onClick={() => handleDelete()}
              >
                delete
              </button>
            )}

            <dialog id="my_modal_2" className="modal">
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
        </div>
      </div>
    </div>
  );
};
export default GameItem;
