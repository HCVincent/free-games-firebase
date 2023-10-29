import { Game, gameState } from "@/atoms/gamesAtom";
import GamesVerticalList from "@/components/GamesLists/GamesVerticalList/GamesVerticalList";
import PageContent from "@/components/Layout/PageContent";
import { auth, firestore } from "@/firebase/clientApp";
import { collection, getDocs, query, where } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import { useRecoilValue } from "recoil";

type CollectionsProps = {
  uid: string;
};
const CollectionPage: React.FC<CollectionsProps> = ({ uid }) => {
  const [collections, setCollections] = useState<Game[]>([]);
  const [userMatch, setUserMatch] = useState(false);
  const gameStateValue = useRecoilValue(gameState);
  const [user] = useAuthState(auth);
  const gamesRef = collection(firestore, "games");
  let array: string[] = [];
  gameStateValue.gameCollections.map((item, i) => {
    array[i] = item.gameId;
  });

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
    <div className="flex w-full  justify-center ">
      {userMatch ? (
        <div className="flex w-full  justify-center">
          <PageContent>
            <div className="justify-start w-full">
              {collections && collections.length > 0 ? (
                <div className="w-full">
                  <GamesVerticalList games={collections} />
                </div>
              ) : (
                <>no collections yet</>
              )}
            </div>
          </PageContent>
        </div>
      ) : (
        <>you are not authenticated for viewing this</>
      )}
    </div>
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
