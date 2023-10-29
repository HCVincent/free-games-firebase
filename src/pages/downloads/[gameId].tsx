import { Game, gameState } from "@/atoms/gamesAtom";
import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

type DownloadPage = {};

const DownloadPage: React.FC<DownloadPage> = () => {
  const router = useRouter();
  const gameStateValue = useRecoilValue(gameState);
  const setGameStateValue = useSetRecoilState(gameState);
  const game: Game = gameStateValue.selectedGame!;
  const [timeLeft, setTimeLeft] = useState(5);
  const [toDownload, setToDownload] = useState(false);

  useEffect(() => {
    // Exit if the timer reaches zero
    if (timeLeft <= 0) {
      setToDownload(true);
      return;
    }

    // Update the timer every second
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up the timer when the component unmounts
    return () => {
      setToDownload(false);
      clearInterval(timer);
    };
  }, [timeLeft]);

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

  return (
    <div className="flex flex-col w-5/6 h-[calc(50vw-14rem)] mb-20 justify-center items-center">
      <div className="flex  w-full h-[60rem] justify-center items-center mt-10">
        <div className="flex flex-col flex-1 w-full h-full justify-center items-center">
          {" "}
          <span className="countdown font-mono text-6xl">
            <span style={{ "--value": timeLeft } as React.CSSProperties}></span>
          </span>
          <div>
            {game && (
              <button
                className="btn btn-lg"
                disabled={!toDownload}
                onClick={() => {
                  window.open(`${game.address}`, "_blank");
                }}
              >
                Download
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DownloadPage;
