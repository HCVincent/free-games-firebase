import { Game, gameState } from "@/atoms/gamesAtom";
import PageContent from "@/components/Layout/PageContent";
import RelatedGames from "@/components/RelatedGames/RelatedGames";
import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { Suspense, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

const GameDetailItem = dynamic(
  () => import("../../components/GamesDetailItem/GameDetailItem"),
  {
    ssr: false,
  }
);
const GamePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const gameStateValue = useRecoilValue(gameState);
  const setGameStateValue = useSetRecoilState(gameState);
  const game: Game = gameStateValue.selectedGame!;
  const fetchGame = async (gameId: string) => {
    try {
      setLoading(true);
      const gameDocRef = doc(firestore, "games", gameId);
      const gameDoc = await getDoc(gameDocRef);
      setGameStateValue((prev) => ({
        ...prev,
        selectedGame: { id: gameDoc.id, ...gameDoc.data() } as Game,
      }));
    } catch (error) {
      console.log("fetchGame error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const { gameId } = router.query;
    if (gameId && !gameStateValue.selectedGame) {
      fetchGame(gameId as string);
    }
  }, [router.query, gameStateValue.selectedGame]);

  return (
    <div className="flex flex-col lg:flex-row w-full h-auto justify-center">
      {loading ? (
        <div className="flex w-full h-full items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <PageContent>
          <div className="flex  w-full min-h-[120rem] lg:min-h-[120rem] ">
            {gameStateValue.selectedGame && (
              <GameDetailItem game={gameStateValue.selectedGame} />
            )}
          </div>
          <div className=" w-full  lg:flex lg:flex-col pl-5 min-h-[120rem] ">
            {game && game.tags && (
              <RelatedGames
                gameTag={
                  game.tags[Math.floor(Math.random() * game.tags.length)]
                }
                gameId={game.id!}
              />
            )}
          </div>
        </PageContent>
      )}
    </div>
  );
};

export default GamePage;
