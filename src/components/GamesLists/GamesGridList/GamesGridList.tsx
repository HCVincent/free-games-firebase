import { Game, gameState } from "@/atoms/gamesAtom";
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
import { useRecoilValue } from "recoil";
import GamesGridItem from "./GamesGridItem";
type GamesGridListProps = {};

const orderByOptions = {
  UPDATED_TIME: "updatedAt",
  LIKES: "likes",
};

const GamesGridList: React.FC<GamesGridListProps> = ({}) => {
  let next: Query<DocumentData>;
  const {
    lastVisible,
    setLastVisible,
    readGames,
    numOfGamesPerPage,
    setGameStateValue,
  } = useGames();
  const [orderedBy, setOrderedBy] = useState(orderByOptions.UPDATED_TIME);
  const [noMoreLoad, setNoMoreLoad] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const gameStateValue = useRecoilValue(gameState);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderedBy(event.target.value);
  };

  const handleOnReadGames = async () => {
    setLoading(true);
    try {
      await readGames("games", undefined, 9);
    } catch (error) {
      console.log("handleOnReadGames error", error);
    }
    setLoading(false);
  };
  const loadMore = async () => {
    setLoadMoreLoading(true);
    // Construct a new query starting at this document,
    const limitedNumber = 9;
    next =
      orderedBy === orderByOptions.UPDATED_TIME
        ? query(
            collection(firestore, "games"),
            orderBy("updatedAt", "desc"),
            startAfter(lastVisible),
            limit(limitedNumber)
          )
        : query(
            collection(firestore, "games"),
            orderBy("voteStatus", "desc"),
            startAfter(lastVisible),
            limit(limitedNumber)
          );
    const newGameDocs = await getDocs(next);
    if (newGameDocs.docs.length < limitedNumber) {
      setNoMoreLoad(true);
    }
    const games: Game[] = newGameDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Game[];
    if (games.length < numOfGamesPerPage) {
      setNoMoreLoad(true);
    } else {
      setNoMoreLoad(false);
    }
    setLastVisible(newGameDocs.docs[newGameDocs.docs.length - 1]);
    setGameStateValue((prev) => ({
      ...prev,
      games: [...prev.games, ...games], // Update the line to spread the games array
    }));
    setLoadMoreLoading(false);
  };
  const fetchGamesByUpdatedTime = async () => {
    const gameQuery = query(
      collection(firestore, "games"),
      orderBy("updatedAt", "desc"),
      limit(9)
    );
    const gameDocs = await getDocs(gameQuery);
    const documentSnapShot = gameDocs.docs[gameDocs.docs.length - 1];
    const games = gameDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setGameStateValue((prev) => ({
      ...prev,
      games: games as Game[],
    }));
    setLastVisible(documentSnapShot);
  };
  const fetchGamesByLikes = async () => {
    const gameQuery = query(
      collection(firestore, "games"),
      orderBy("voteStatus", "desc"),
      limit(9)
    );
    const gameDocs = await getDocs(gameQuery);
    const documentSnapShot = gameDocs.docs[gameDocs.docs.length - 1];
    const games = gameDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setGameStateValue((prev) => ({
      ...prev,
      games: games as Game[],
    }));
    setLastVisible(documentSnapShot);
  };
  useEffect(() => {
    handleOnReadGames();
  }, []);
  useEffect(() => {
    fetchGamesByUpdatedTime();
  }, []);

  useEffect(() => {
    const fetchAndSortGames = async () => {
      // Fetch games logic...
      // After fetching, sort the games based on the selected orderBy state
      if (orderedBy === orderByOptions.UPDATED_TIME) {
        fetchGamesByUpdatedTime(); // Assuming updatedAt is a timestamp
      } else if (orderedBy === orderByOptions.LIKES) {
        fetchGamesByLikes(); // Assuming likes is a number
      }
    };

    fetchAndSortGames();
  }, [orderedBy]);

  return (
    <>
      {loading ? (
        <div className="flex w-full h-screen justify-center items-center">
          <span className="loading loading-spinner w-40 h-40"></span>
        </div>
      ) : (
        <div className="flex flex-col items-center h-full justify-between mt-10">
          <div className="w-full flex justify-end">
            <div className="form-control">
              <label className="label cursor-pointer space-x-2 p-2 hover:bg-slate-600 rounded-xl">
                <span className="label-text capitalize text-xl">latest</span>
                <input
                  type="radio"
                  name="radio-10"
                  className="radio checked:bg-red-500"
                  value={orderByOptions.UPDATED_TIME}
                  checked={orderedBy === orderByOptions.UPDATED_TIME}
                  onChange={handleRadioChange}
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer space-x-2 p-2 hover:bg-slate-600 rounded-xl">
                <span className="label-text capitalize text-xl">
                  most likes
                </span>
                <input
                  type="radio"
                  name="radio-10"
                  className="radio checked:bg-blue-500"
                  value={orderByOptions.LIKES}
                  checked={orderedBy === orderByOptions.LIKES}
                  onChange={handleRadioChange}
                />
              </label>
            </div>
          </div>
          <div className="flex flex-col  h-full  gap-y-6 lg:grid lg:grid-cols-3 lg:gap-10">
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
              <div className="flex w-full h-[6rem] justify-center mt-20 mb-20">
                {loadMoreLoading ? (
                  <div className="flex w-full h-full items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : (
                  <button
                    className="btn btn-ghost mt-4 w-full h-full normal-case text-4xl"
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
