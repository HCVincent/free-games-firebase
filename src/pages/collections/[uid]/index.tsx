import React, { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, firestore } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import useGames from "@/hooks/useGames";
import { Game } from "@/atoms/gamesAtom";

type CollectionsProps = {
  uid: string;
};

const CollectionPage: React.FC<CollectionsProps> = ({ uid }) => {
  const [collections, setCollections] = useState<Game[]>([]);
  const [user] = useAuthState(auth);
  const { gameStateValue } = useGames();
  const gamesRef = collection(firestore, "games");
  let array: string[] = [];
  console.log("gameStateValue.gameCollections", gameStateValue.gameCollections);
  gameStateValue.gameCollections.map((item, i) => {
    array[i] = item.gameId;
  });

  // modify here, it is supposed to query each id in array

  useEffect(() => {
    const getSth = async () => {
      if (array.length > 0) {
        const q = query(gamesRef, where("id", "in", array));
        const result = await getDocs(q);
        const games = result.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Game[];
        setCollections(games);
        console.log("games", games);
      }
    };
    getSth();
  }, [gameStateValue.gameCollections]);
  return (
    <>
      {collections && collections.length > 0 ? (
        collections.map((item) => <>{item.title}</>)
      ) : (
        <>loading</>
      )}
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    return {
      props: {
        uid: context.query.uid as string,
      },
    };
  } catch (error) {
    console.log("getServerSideProps error", error);
  }
}

export default CollectionPage;
