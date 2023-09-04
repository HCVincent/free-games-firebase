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
import GamesGridItem from "./GamesGridItem";
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
  const { gameStateValue, onVote, onCollect, onSelectGame } = useGames();
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
    if (games.length < numOfGamesPerPage) {
      setNoMoreLoad(true);
    } else {
      setNoMoreLoad(false);
    }
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

  return (
    <>
      {loading ? (
        <div className="flex w-full h-screen justify-center items-center">
          <span className="loading loading-spinner w-40 h-40"></span>
        </div>
      ) : (
        <div className="flex flex-col items-center h-full justify-between mt-10">
          <div className="flex flex-col items-center h-full justify-between lg:grid lg:grid-cols-4 lg:gap-10">
            {gameStateValue.games.map((game) => (
              <GamesGridItem
                key={game.id}
                game={game}
                userCollectionValue={
                  gameStateValue.gameCollections.find(
                    (collection) => collection.gameId === game.id
                  )?.gameId
                }
                userVoteValue={
                  gameStateValue.gameVotes.find(
                    (vote) => vote.gameId === game.id
                  )?.voteValue
                }
                onVote={onVote}
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
                    className="btn btn-ghost mt-4 w-full h-full normal-case"
                    onClick={loadMore}
                  >
                    Load More
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
