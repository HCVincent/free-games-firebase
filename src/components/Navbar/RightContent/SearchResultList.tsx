import { Game } from "@/atoms/gamesAtom";
import React from "react";

type SearchResultListProps = {
  results: Game[];
};

const SearchResultList: React.FC<SearchResultListProps> = ({ results }) => {
  return (
    <div className="relative mt-1  ">
      <div className="absolute h-full w-full  ">
        <div className="flex flex-col bg-base-200 rounded-md">
          {results.map((game) => (
            <span key={game.id} className="flex">
              {game.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SearchResultList;
