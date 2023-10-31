import { gameState } from "@/atoms/gamesAtom";
import TagCard from "@/components/Tags/TagCard";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const TagsRead: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const gameStateValue = useRecoilValue(gameState);

  useEffect(() => {
    // If gameStateValue has been set and tags are available, then set loading to false
    if (
      gameStateValue &&
      gameStateValue.gameTags &&
      gameStateValue.gameTags.length > 0
    ) {
      setLoading(false);
    }
  }, [gameStateValue, gameStateValue.gameTags]); // Add gameStateValue.gameTags to the dependency array

  // Ensure to handle the case when gameStateValue or gameStateValue.gameTags is not yet available
  if (!gameStateValue || !gameStateValue.gameTags) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap min-h-[12rem] lg:min-h-[10rem] overflow-hidden items-start w-full p-10">
      {loading ? (
        <div className="flex w-full h-full items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="flex flex-wrap items-start">
          {gameStateValue.gameTags.map((tag) => (
            <TagCard tag={tag.title} key={tag.id}></TagCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagsRead;
