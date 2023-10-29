import { GameTag } from "@/atoms/gamesAtom";
import useGames from "@/hooks/useGames";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import default_cover from "../../../public/default_cover.png";

type RelatedGamesProps = {
  gameTag: string;
  gameId: string;
};

const RelatedGames: React.FC<RelatedGamesProps> = ({ gameTag, gameId }) => {
  const { readGamesByTag, gameStateValue, onSelectGame } = useGames();
  const handleOnReadGames = async () => {
    try {
      await readGamesByTag(gameTag, 4, gameId);
    } catch (error) {
      console.log("handleOnReadGames error", error);
    }
  };
  useEffect(() => {
    handleOnReadGames();
  }, []);
  return (
    <div className="flex flex-col justify-center items-center mt-10 w-full h-[1100px]">
      <span className="text-4xl font-bold">More Games</span>
      <div className="flex flex-col justify-center items-center">
        {gameStateValue.gamesInTag.map((game) => (
          <div
            className="card card-compact w-96 bg-base-100 shadow-xl my-5 cursor-pointer hover:scale-105 transition-all"
            key={game.id}
            onClick={() => onSelectGame(game)}
          >
            <Image
              width={300}
              height={200}
              src={game.coverImage ? game.coverImage : default_cover}
              alt={game.title}
              className="w-96 h-72"
            />
            <div className="card-body">
              <h2 className="card-title capitalize">{game.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RelatedGames;
