import { Game } from "@/atoms/gamesAtom";
import React from "react";
import GameCover from "./GameCover";
import moment from "moment";
import { User } from "firebase/auth";
import Comments from "./Comments/Comments";

type GameDetailItemProps = { game: Game; user: User };

const GameDetailItem: React.FC<GameDetailItemProps> = ({ game, user }) => {
  return (
    <div className="flex flex-col">
      <GameCover coverImage={game.coverImage} imagesGroup={game.imagesGroup} />
      <span className="mt-10 text-6xl font-bold">{game.title}</span>
      {game.createdAt && (
        <span className="text-xs">
          {moment(new Date(game.createdAt?.seconds * 1000)).fromNow()}
        </span>
      )}
      <span className="mt-10">{game.body}</span>
      <Comments game={game} user={user} />
    </div>
  );
};
export default GameDetailItem;
