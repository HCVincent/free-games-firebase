import { Game } from "@/atoms/gamesAtom";
import useGames from "@/hooks/useGames";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const GamePage: React.FC = () => {
  const router = useRouter();
  const { gameStateValue } = useGames();
  const game: Game = gameStateValue.selectedGame!;
  useEffect(() => {
    const { gid } = router.query;
    if (gid && !gameStateValue.selectedGame) {
      //   fetchPost(gid as string);
    }
  }, [router.query, gameStateValue.selectedGame]);
  return <div>{game.title}</div>;
};
export default GamePage;
