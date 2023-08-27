import { Game } from "@/atoms/gamesAtom";
import { NextRouter } from "next/router";
import React, { useEffect, useState } from "react";
import GamesGridItem from "./GamesGridItem";
import useGames from "@/hooks/useGames";
import {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
type GamesGridListProps = {};

const GamesGridList: React.FC<GamesGridListProps> = () => {
  let next: Query<DocumentData>;
  const {
    lastVisible,
    setLastVisible,
    readGames,
    numOfGamesPerPage,
    setGameStateValue,
  } = useGames();
  const [noMoreLoad, setNoMoreLoad] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
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
  const loadMore = async () => {
    setLoadMoreLoading(true);
    // Construct a new query starting at this document,
    next = query(
      collection(firestore, "games"),
      orderBy("updatedAt", "desc"),
      startAfter(lastVisible),
      limit(15)
    );
    const newGameDocs = await getDocs(next);
    if (newGameDocs.docs.length < 15) {
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
      if (gameStateValue.games.length === 15) {
        setNoMoreLoad(false);
      } else {
        setNoMoreLoad(true);
      }
    };
    checkIfLoadMore();
  }, [gameStateValue.games]);
  return (
    <>
      {loading ? (
        <div className="flex w-full h-screen justify-center items-center">
          <span className="loading loading-spinner w-40 h-40"></span>
        </div>
      ) : (
        <div className="flex flex-col items-center h-full justify-between mt-10">
          <div className="flex flex-col items-center h-full justify-between lg:grid lg:grid-cols-5 lg:gap-4">
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
          <div className="flex w-full">
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
              <div className="flex w-full h-50 justify-center">
                {loadMoreLoading ? (
                  <div className="flex w-full h-full items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : (
                  <button
                    className="btn btn-ghost mt-4 w-full h-full"
                    onClick={loadMore}
                  >
                    load more
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default GamesGridList;
