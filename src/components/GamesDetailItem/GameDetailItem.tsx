import { Game } from "@/atoms/gamesAtom";
import React from "react";
import GameCover from "./GameCover";
import moment from "moment";
import { User } from "firebase/auth";
import Comments from "./Comments/Comments";
import ThumbsLike from "../IndexPageContent/Recommendation/ThumbsLike";
import useGames from "@/hooks/useGames";

type GameDetailItemProps = { game: Game; user: User };

const GameDetailItem: React.FC<GameDetailItemProps> = ({ game, user }) => {
  const { onSelectGame, gameStateValue, onVote, onCollect } = useGames();
  return (
    <div className="flex flex-col">
      <GameCover coverImage={game.coverImage} imagesGroup={game.imagesGroup} />
      <div className="flex mt-10 items-center justify-between">
        <span className=" text-6xl font-bold">{game.title}</span>
        <ThumbsLike
          userVoteValue={
            gameStateValue.gameVotes.find((vote) => vote.gameId === game.id)
              ?.voteValue
          }
          game={game}
          userCollectionValue={
            gameStateValue.gameCollections.find(
              (collection) => collection.gameId === game.id
            )?.gameId
          }
          onCollect={onCollect}
          onVote={onVote}
        />
      </div>

      {game.createdAt && (
        <span className="text-xs mt-2">
          {moment(new Date(game.createdAt?.seconds * 1000)).fromNow()}
        </span>
      )}
      <span className="mt-10">{game.body}</span>
      <Comments game={game} user={user} />
    </div>
  );
};
export default GameDetailItem;
