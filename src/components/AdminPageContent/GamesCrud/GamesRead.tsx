import { firestore } from "@/firebase/clientApp";
import useGames from "@/hooks/useGames";
import {
  DocumentData,
  Query,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";

import React, { useEffect, useState } from "react";
import GameItem from "./GameItem";

type GamesReadProps = {};

const GamesRead: React.FC<GamesReadProps> = () => {
  let next: Query<DocumentData>;
  const [noMoreLoad, setNoMoreLoad] = useState(false);
  const { lastVisible, setLastVisible, readGames, numOfGamesPerPage } =
    useGames();
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { onSelectGame, gameStateValue, setGameStateValue } = useGames();

  const handleOnReadGames = async () => {
    setLoading(true);
    try {
      await readGames("games");
    } catch (error) {
      console.log("handleOnReadGames error", error);
    }
    setLoading(false);
  };

  const loadMore = async () => {
    setLoadMoreLoading(true);
    // Construct a new query starting at this document,
    // get the next 25 cities.
    next = query(
      collection(firestore, "games"),
      orderBy("updatedAt", "desc"),
      startAfter(lastVisible),
      limit(numOfGamesPerPage)
    );
    const newGameDocs = await getDocs(next);
    if (newGameDocs.docs.length < numOfGamesPerPage) {
      setNoMoreLoad(true);
    }
    const games = newGameDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLastVisible(newGameDocs.docs[newGameDocs.docs.length - 1]);
    //@ts-ignore
    setGameStateValue((prev) => ({
      ...prev,
      games: [...prev.games, ...games], // Update the line to spread the games array
    }));
    setLoadMoreLoading(false);
  };

  useEffect(() => {
    handleOnReadGames();
  }, []);

  useEffect(() => {
    const checkIfLoadMore = () => {
      if (gameStateValue.games.length < numOfGamesPerPage) {
        setNoMoreLoad(true);
      } else {
        setNoMoreLoad(false);
      }
    };
    checkIfLoadMore();
  }, [gameStateValue.games]);

  return (
    <div className="flex flex-col flex-1 py-2 ">
      {loading ? (
        <div className="flex h-full justify-center align-middle items-center ">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center h-full justify-between lg:grid lg:grid-cols-5 lg:gap-4 lg:mt-4">
            {gameStateValue.games.map((game, index) => (
              <GameItem game={game} key={game.id} />
            ))}
          </div>

          {noMoreLoad ? (
            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>this is a bottom line</span>
            </div>
          ) : (
            <>
              {loadMoreLoading ? (
                <div className="flex w-full h-full items-center justify-center">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : (
                <button
                  className="btn btn-ghost w-full mt-4"
                  onClick={loadMore}
                >
                  load more
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
export default GamesRead;
