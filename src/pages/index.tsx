//@ts-ignore
import { Game, gameState } from "@/atoms/gamesAtom";
import { firestore } from "@/firebase/clientApp";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
// @ts-ignore
import safeJsonStringify from "safe-json-stringify";
import { useSetRecoilState } from "recoil";
const RecommendationLists = dynamic(
  () =>
    import("@/components/IndexPageContent/Recommendation/RecommendationLists")
);

const GamesGridList = dynamic(
  () => import("../components/GamesLists/GamesGridList/GamesGridList")
);
const TagsCategories = dynamic(
  () =>
    import("@/components/IndexPageContent/TagsCategories.tsx/TagsCategories")
);
type RecommendationListsProps = {
  recommendations: Game[];
};
const Home: React.FC<RecommendationListsProps> = ({ recommendations }) => {
  const setGameStateValue = useSetRecoilState(gameState);
  useEffect(() => {
    setGameStateValue((prev) => ({
      ...prev,
      gameRecommendations: recommendations as Game[],
    }));
  }, [recommendations]);

  return (
    <div className="flex flex-col w-full items-center mt-5">
      <div className="flex flex-col w-full justify-center  lg:w-5/6">
        <RecommendationLists />
        <TagsCategories />
        <GamesGridList />
      </div>
    </div>
  );
};
export const revalidate = 59;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    context.res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=59"
    );
    const gameRecQuery = query(
      collection(firestore, "recommendations"),
      orderBy("updatedAt", "desc"),
      limit(9)
    );
    const gameRecDocs = await getDocs(gameRecQuery);
    const recommendations = gameRecDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      props: {
        recommendations: JSON.parse(safeJsonStringify(recommendations)),
      },
    };
  } catch (error) {
    console.log("getServerSideProps error", error);
  }
}
export default Home;
