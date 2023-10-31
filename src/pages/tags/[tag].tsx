import GamesVerticalList from "@/components/GamesLists/GamesVerticalList/GamesVerticalList";
import PageContent from "@/components/Layout/PageContent";
import useGames from "@/hooks/useGames";
import { useRouter } from "next/router";
import Script from "next/script";
import React, { useEffect, useState } from "react";
//@ts-ignore
import safeJsonStringify from "safe-json-stringify";
import { GetServerSidePropsContext } from "next";
import {
  query,
  collection,
  orderBy,
  where,
  limit,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
  startAfter,
  Query,
} from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { Game } from "@/atoms/gamesAtom";
import TagCard from "@/components/Tags/TagCard";
type TagPageProps = {
  // documentSnapShot: QueryDocumentSnapshot<DocumentData>;
  // gamesInTag: Game[];
  tag: string;
};
const TagPage: React.FC<TagPageProps> = ({
  // documentSnapShot,
  // gamesInTag,
  tag,
}) => {
  let next: Query<DocumentData>;
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData>>();
  const { setGameStateValue, gameStateValue } = useGames();
  const [noMoreLoad, setNoMoreLoad] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoadMoreLoading(true);
    // Construct a new query starting at this document,
    const limitedNumber = 9;
    next = query(
      collection(firestore, "games"),
      orderBy("updatedAt", "desc"),
      where("tags", "array-contains", tag),
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
    if (games.length < 9) {
      setNoMoreLoad(true);
    } else {
      setNoMoreLoad(false);
    }
    setLastVisible(newGameDocs.docs[newGameDocs.docs.length - 1]);
    setGameStateValue((prev) => ({
      ...prev,
      gamesInTag: [...prev.gamesInTag, ...games], // Update the line to spread the games array
    }));
    setLoadMoreLoading(false);
  };

  useEffect(() => {
    const fetchGamesInTag = async () => {
      setLoading(true);
      const gameQuery = query(
        collection(firestore, "games"),
        orderBy("updatedAt", "desc"),
        where("tags", "array-contains", tag),
        limit(9)
      );

      const gameDocs = await getDocs(gameQuery);
      const games = gameDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGameStateValue((prev) => ({
        ...prev,
        gamesInTag: games as Game[],
      }));
      setLastVisible(gameDocs.docs[gameDocs.docs.length - 1]);
      if (games.length < 9) setNoMoreLoad(true);
      setLoading(false);
    };
    fetchGamesInTag();
  }, []);
  return (
    <div className="flex w-full justify-center items-center">
      {loading ? (
        <div className="flex w-full h-full items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <PageContent>
          <div className="justify-start w-full  h-[280rem]">
            <div className="w-full">
              {loading ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : (
                <div className="flex flex-col">
                  <span className="mt-10 px-10 text-2xl font-bold">
                    {tag} Games
                  </span>
                  <GamesVerticalList games={gameStateValue.gamesInTag || []} />
                </div>
              )}
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
                <div className="flex w-full justify-center">
                  {loadMoreLoading ? (
                    <div className="flex w-full  items-center justify-center">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  ) : (
                    <button
                      className="btn btn-ghost mt-4 w-full  normal-case text-4xl"
                      onClick={loadMore}
                    >
                      Load More
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full  justify-center items-start h-[80rem] lg:h-[280rem]">
            <div className="flex flex-wrap mt-10">
              {gameStateValue.gameTags.map((tag) => (
                <TagCard tag={tag.title} key={tag.id}></TagCard>
              ))}
            </div>
          </div>
        </PageContent>
      )}
    </div>
  );
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    context.res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=59"
    );
    const tag = context.query.tag;
    // const gameQuery = query(
    //   collection(firestore, "games"),
    //   orderBy("updatedAt", "desc"),
    //   where("tags", "array-contains", tag),
    //   limit(9)
    // );

    // const gameDocs = await getDocs(gameQuery);
    // const games = gameDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // const documentSnapShot = gameDocs.docs[gameDocs.docs.length - 1];
    return {
      props:
        {
          // documentSnapShot: JSON.parse(safeJsonStringify(documentSnapShot)),
          // gamesInTag: JSON.parse(safeJsonStringify(games)),
          tag: JSON.parse(safeJsonStringify(tag)),
        } || {},
    };
  } catch (error) {
    console.log("getServerSideProps error", error);
  }
}
export default TagPage;
