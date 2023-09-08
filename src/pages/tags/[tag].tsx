import GamesVerticalList from "@/components/GamesLists/GamesVerticalList/GamesVerticalList";
import PageContent from "@/components/Layout/PageContent";
import useGames from "@/hooks/useGames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const TagPage: React.FC = () => {
  const router = useRouter();
  const { tag } = router.query;
  const [loading, setLoading] = useState(false);
  const { readGamesByTag, gameStateValue } = useGames();
  const handleOnReadGamesByTag = async () => {
    setLoading(true);
    try {
      if (tag) {
        await readGamesByTag(tag.toString());
      } else {
        throw new Error(`Sorry, the page is not ready`);
      }
    } catch (error) {
      console.log("handleOnReadGamesByTag error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleOnReadGamesByTag();
  }, [tag]);
  return (
    <div className="flex w-full">
      <PageContent>
        <div className="justify-start w-full">
          <div className="w-full">
            <span className="px-10 text-2xl">{tag} Games</span>
            {loading ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              <GamesVerticalList games={gameStateValue.gamesInTag} />
            )}
          </div>
        </div>
        <>advertisement</>
      </PageContent>
    </div>
  );
};
export default TagPage;
