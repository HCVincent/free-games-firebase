import { Game } from "@/atoms/gamesAtom";
import useGames from "@/hooks/useGames";
import React from "react";
import GamesVerticalItem from "./GamesVerticalItem";

type GamesVerticalListProps = {
  games: Game[];
};

const GamesVerticalList: React.FC<GamesVerticalListProps> = ({ games }) => {
  const { gameStateValue, onSelectGame } = useGames();
  return (
    <div className="flex flex-col w-full">
      {games &&
        games.map((item) => (
          <GamesVerticalItem
            key={item.id}
            game={item}
            userCollectionValue={
              gameStateValue.gameCollections.find(
                (collection) => collection.gameId === item.id
              )?.gameId
            }
            userVoteValue={
              gameStateValue.gameVotes.find((vote) => vote.gameId === item.id)
                ?.voteValue
            }
            onSelectGame={onSelectGame}
          />
          //   onClick={() => {
          //     router.push(`/games/${item.id}`);
          //   }}
          //   key={item.id}
        ))}
    </div>
  );
};
export default GamesVerticalList;
