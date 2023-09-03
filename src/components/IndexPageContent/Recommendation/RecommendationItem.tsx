import { Game } from "@/atoms/gamesAtom";
import React, { useState } from "react";
import Image from "next/image";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import moment from "moment";
import ThumbsLike from "./ThumbsLike";
import Link from "next/link";
type RecommendationItemProps = {
  game: Game;
  index: number;
  onSelectGame: (game: Game) => void;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Game,
    vote: number
  ) => Promise<boolean>;
  onCollect: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Game
  ) => Promise<boolean>;
  userVoteValue?: number;
  userCollectionValue?: string;
};

const RecommendationItem: React.FC<RecommendationItemProps> = ({
  game,
  index,
  onSelectGame,
  onVote,
  onCollect,
  userVoteValue,
  userCollectionValue,
}) => {
  return (
    <div
      id={`slide${index}`}
      className="embla__slide relative w-full h-[540px]  bg-slate-600 flex flex-col"
      key={game.id}
    >
      <div className="embla__slide__number">
        <span>{index + 1}</span>
      </div>
      <Link href={`/games/${game.id}`}>
        <Image
          /* @ts-ignore */
          src={game.coverImage}
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          className="embla__slide__img flex object-cover w-full h-[480px] cursor-pointer"
          // onClick={() => {
          //   onSelectGame(game);
          // }}
        />
      </Link>

      <div className="flex flex-1 h-full items-center justify-between px-8">
        <div className="flex items-end p-2">
          <span className="text-xl  text-white max-w-2xl line-clamp-1 lg:text-4xl">
            {game.title.charAt(0).toUpperCase() + game.title.slice(1)}
          </span>
          <span className="ml-2 text-slate-500">
            updated at{" "}
            {game.createdAt &&
              moment(new Date(game.createdAt.seconds * 1000)).fromNow()}
          </span>
        </div>
        <div className="flex flex-col flex-0 min-w-[20rem] ">
          <ThumbsLike
            userVoteValue={userVoteValue}
            game={game}
            userCollectionValue={userCollectionValue}
            onCollect={onCollect}
            onVote={onVote}
          />
        </div>
      </div>
    </div>
  );
};
export default RecommendationItem;
