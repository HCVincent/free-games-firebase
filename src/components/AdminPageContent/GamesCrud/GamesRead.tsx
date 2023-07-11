import { Game } from "@/atoms/gamesAtom";
import { firestore } from "@/firebase/clientApp";
import useGames from "@/hooks/useGames";
import { query, collection, orderBy, limit, getDocs } from "firebase/firestore";

import React, { useEffect, useState } from "react";
import GameItem from "./GameItem";

type GamesReadProps = {};

const GamesRead: React.FC<GamesReadProps> = () => {
  const [loading, setLoading] = useState(false);
  const { onSelectGame, gameStateValue, setGameStateValue } = useGames();
  const readGames = async () => {
    setLoading(true);
    try {
      const gameQuery = query(
        collection(firestore, "games"),
        orderBy("createdAt", "desc")
      );
      const gameDocs = await getDocs(gameQuery);
      const games = gameDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGameStateValue((prev) => ({
        ...prev,
        games: games as Game[],
      }));
    } catch (error) {
      console.log("readGames error", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    readGames();
  }, []);
  return (
    <div className="flex flex-col  py-2 h-2/3">
      {loading ? (
        <div className="flex h-full justify-center align-middle items-center ">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      ) : (
        <div className="flex flex-col items-center lg:grid lg:grid-cols-4 lg:gap-4 ">
          {gameStateValue.games.map((game) => (
            <GameItem game={game} key={game.id} />
          ))}
        </div>
      )}
    </div>
  );
};
export default GamesRead;
