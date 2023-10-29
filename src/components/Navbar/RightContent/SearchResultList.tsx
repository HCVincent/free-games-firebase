import { Game } from "@/atoms/gamesAtom";
import Image from "next/image";
import React from "react";
import defaultImage from "../../../../public/default_cover.png";
import { useRouter } from "next/router";

type SearchResultListProps = {
  results: Game[];
};

const SearchResultList: React.FC<SearchResultListProps> = ({ results }) => {
  const router = useRouter();

  return (
    <div className="relative mt-1  ">
      <div className="absolute h-full w-full  ">
        <div className="flex flex-col bg-base-200 rounded-md">
          {results.map((game) => (
            <div
              key={game.id}
              className="flex h-16 align-middle center hover:bg-slate-700"
              onClick={() => {
                router.push(`/games/${game.id}`);
              }}
            >
              <Image
                alt={game.id!}
                src={game.coverImage || defaultImage}
                width={60}
                height={40}
                className="object-cover rounded-md"
              />
              <span className="text-xl  w-full line-clamp-2 overflow-hidden capitalize">
                {game.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SearchResultList;
