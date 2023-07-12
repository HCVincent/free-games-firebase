import { Game } from "@/atoms/gamesAtom";
import React, { useState } from "react";
import { Image } from "@chakra-ui/react";
import moment from "moment";
import default_cover from "../../../../public/default_cover.png";
import useGames from "@/hooks/useGames";

type GameItemProps = {
  game: Game;
};

const GameItem: React.FC<GameItemProps> = ({ game }) => {
  const { onDeleteGame } = useGames();
  const [loading, setLoading] = useState(true);
  const handleDelete = () => {
    onDeleteGame(game);
  };
  return (
    <div className="flex ">
      <div className="card w-56 bg-base-100 shadow-xl">
        <figure className="h-full">
          <div className="flex w-full h-32 items-start justify-start">
            {loading && (
              <div className="flex w-full h-full items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            )}
            <Image
              alt={game.title}
              src={game.coverImage ? game.coverImage : default_cover.src}
              display={loading ? "none" : "unset"}
              className="w-full object-cover rounded-lg "
              onLoad={() => setLoading(false)}
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
          <div className="card-actions w-full justify-between">
            <button className="btn btn-ghost">update</button>
            <button className="btn btn-ghost" onClick={() => handleDelete()}>
              delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GameItem;
