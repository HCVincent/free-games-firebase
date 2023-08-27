import { Game } from "@/atoms/gamesAtom";
import { NextRouter } from "next/router";
import React, { useEffect, useState } from "react";
import GamesGridItem from "./GamesGridItem";
import useGames from "@/hooks/useGames";

type GamesGridListProps = {};

const GamesGridList: React.FC<GamesGridListProps> = () => {
  const { lastVisible, setLastVisible, readGames, numOfGamesPerPage } =
    useGames();
  const [loading, setLoading] = useState(false);
  const { gameStateValue, onCollect, onSelectGame } = useGames();
  const handleOnReadGames = async () => {
    setLoading(true);
    try {
      await readGames("games", undefined, 15);
    } catch (error) {
      console.log("handleOnReadGames error", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    handleOnReadGames();
  }, []);
  return (
    <div className="flex flex-col items-center h-full justify-between lg:grid lg:grid-cols-5 lg:gap-4 lg:mt-4">
      {gameStateValue.games.map((item) => (
        <GamesGridItem
          key={item.id}
          game={item}
          userCollectionValue={
            gameStateValue.gameCollections.find(
              (collection) => collection.gameId === item.id
            )?.gameId
          }
          onCollect={onCollect}
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
export default GamesGridList;
