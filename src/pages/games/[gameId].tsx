import { Game } from "@/atoms/gamesAtom";
import { firestore } from "@/firebase/clientApp";
import useGames from "@/hooks/useGames";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const GamePage: React.FC = () => {
  const router = useRouter();
  const { gameStateValue, setGameStateValue } = useGames();
  const game: Game = gameStateValue.selectedGame!;

  const fetchGame = async (gameId: string) => {
    try {
      const gameDocRef = doc(firestore, "games", gameId);
      const gameDoc = await getDoc(gameDocRef);
      setGameStateValue((prev) => ({
        ...prev,
        selectedGame: { id: gameDoc.id, ...gameDoc.data() } as Game,
      }));
    } catch (error) {
      console.log("fetchGame error", error);
    }
  };

  useEffect(() => {
    const { gameId } = router.query;
    if (gameId && !gameStateValue.selectedGame) {
      fetchGame(gameId as string);
    }
  }, [router.query, gameStateValue.selectedGame]);
  return <div>{gameStateValue.selectedGame && <>{game.title}</>}</div>;
};
export default GamePage;
