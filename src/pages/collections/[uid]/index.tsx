import { Game } from "@/atoms/gamesAtom";
import GamesVerticalList from "@/components/GamesLists/GamesVerticalList/GamesVerticalList";
import PageContent from "@/components/Layout/PageContent";
import { auth, firestore } from "@/firebase/clientApp";
import useGames from "@/hooks/useGames";
import { collection, getDocs, query, where } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type CollectionsProps = {
  uid: string;
};

const CollectionPage: React.FC<CollectionsProps> = ({ uid }) => {
  const router = useRouter();
  const [collections, setCollections] = useState<Game[]>([]);
  const [userMatch, setUserMatch] = useState(false);
  const [user] = useAuthState(auth);
  const { gameStateValue } = useGames();
  const gamesRef = collection(firestore, "games");
  let array: string[] = [];
  gameStateValue.gameCollections.map((item, i) => {
    array[i] = item.gameId;
  });

  // modify here, it is supposed to query each id in array

  useEffect(() => {
    const getCollections = async () => {
      if (user && uid === user.uid) {
        setUserMatch(true);
      }
      if (array.length > 0) {
        const q = query(gamesRef, where("id", "in", array));
        const result = await getDocs(q);
        const games = result.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Game[];
        setCollections(games);
      }
    };
    getCollections();
  }, [gameStateValue.gameCollections, user]);
  return (
    <>
      {userMatch ? (
        <div className="flex w-full">
          <PageContent>
            <div className="justify-start w-full">
              {collections && collections.length > 0 ? (
                <div className="w-full">
                  <GamesVerticalList games={collections} router={router} />
                </div>
              ) : (
                <>loading</>
              )}
            </div>
            <>advertisement</>
          </PageContent>
        </div>
      ) : (
        <>you are not authenticated for viewing this</>
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
