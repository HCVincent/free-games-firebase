import { Game } from "@/atoms/gamesAtom";
import GameDetailItem from "@/components/GamesDetailItem/GameDetailItem";
import PageContent from "@/components/Layout/PageContent";
import { auth, firestore } from "@/firebase/clientApp";
import useGames from "@/hooks/useGames";
import { User } from "@firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const GamePage: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
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
    setGameStateValue((prev) => ({
      ...prev,
      selectedGame: null,
    }));
    const { gameId } = router.query;
    if (gameId) {
      fetchGame(gameId as string);
    }
  }, [router.query]);
  return (
    <div className="flex w-full  justify-center">
      <PageContent>
        <div className="flex  w-full">
          {gameStateValue.selectedGame && (
            <GameDetailItem
              game={gameStateValue.selectedGame}
              user={user as User}
            />
          )}
        </div>
        <div className="flex w-full ">2</div>
      </PageContent>
    </div>
  );
};
export default GamePage;
