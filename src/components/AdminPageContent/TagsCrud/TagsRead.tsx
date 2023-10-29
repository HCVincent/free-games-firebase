import AdminModal from "@/Modal/Admin/AdminModal";
import { gameState } from "@/atoms/gamesAtom";
import TagCard from "@/components/Tags/TagCard";
import useGames from "@/hooks/useGames";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
// import GamesRead from "./GamesRead";

const TagsRead: React.FC = () => {
  const gameStateValue = useRecoilValue(gameState);
  return (
    <div className="flex flex-wrap h-[12rem] lg:h-[10rem] overflow-hidden">
      {gameStateValue.gameTags.map((tag) => (
        <TagCard tag={tag.title} key={tag.id}></TagCard>
      ))}
    </div>
  );
};
export default TagsRead;
