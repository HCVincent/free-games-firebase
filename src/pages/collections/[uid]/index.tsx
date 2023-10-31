import { Game, gameState } from "@/atoms/gamesAtom";
import GamesVerticalList from "@/components/GamesLists/GamesVerticalList/GamesVerticalList";
import PageContent from "@/components/Layout/PageContent";
import RelatedGames from "@/components/RelatedGames/RelatedGames";
import { auth, firestore } from "@/firebase/clientApp";
import { collection, getDocs, query, where } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

type CollectionsProps = {
  uid: string;
};

const CollectionPage: React.FC<CollectionsProps> = ({ uid }) => {
  const [collections, setCollections] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const gameStateValue = useRecoilValue(gameState);
  const [user] = useAuthState(auth);
  const gamesRef = collection(firestore, "games");

  useEffect(() => {
    const getCollections = async () => {
      try {
        if (user && uid === user.uid) {
          const array = gameStateValue.gameCollections.map(
            (item) => item.gameId
          );
          if (array.length > 0) {
            const q = query(gamesRef, where("id", "in", array));
            const result = await getDocs(q);
            const games = result.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Game[];
            setCollections(games);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    getCollections();
  }, [user, uid, gameStateValue.gameCollections]);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user || uid !== user.uid) {
    return <div>you are not authenticated for viewing this</div>;
  }

  return (
    <PageContent>
      <div className="flex w-full justify-center">
        <div className="w-full">
          {collections.length > 0 ? (
            <GamesVerticalList games={collections} />
          ) : (
            <div className="text-center">no collections yet</div>
          )}
        </div>
      </div>
      <div className=" w-full  lg:flex lg:flex-col pl-5 min-h-[120rem] ">
        {collections[0] && collections[0].tags && (
          <RelatedGames
            gameTag={
              collections[0].tags[
                Math.floor(Math.random() * collections[0].tags.length)
              ]
            }
            gameId={collections[0].id!}
          />
        )}
      </div>
    </PageContent>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      uid: context.query.uid as string,
    },
  };
}

export default CollectionPage;
