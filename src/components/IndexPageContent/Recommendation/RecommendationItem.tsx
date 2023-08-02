import { Game } from "@/atoms/gamesAtom";
import React from "react";
import Image from "next/image";

type RecommendationItemProps = {
  game: Game;
  index: number;
  handlePrevSlide: () => void;
  handleNextSlide: () => void;
  onSelectGame: (game: Game) => void;
  currentSlide: number;
};

const RecommendationItem: React.FC<RecommendationItemProps> = ({
  game,
  index,
  handlePrevSlide,
  handleNextSlide,
  currentSlide,
  onSelectGame,
}) => {
  return (
    <div
      id={`slide${index}`}
      className="carousel-item relative w-full h-[540px]  bg-slate-600 flex flex-col"
      key={game.id}
    >
      <Image
        /* @ts-ignore */
        src={game.coverImage}
        alt=""
        width={0}
        height={0}
        sizes="100vw"
        className="flex object-cover w-full h-[480px] cursor-pointer"
        onClick={() => {
          onSelectGame(game);
        }}
      />
      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a
          onClick={handlePrevSlide}
          href={`#slide${currentSlide}`}
          className="btn btn-circle"
        >
          ❮
        </a>
        <a
          onClick={handleNextSlide}
          href={`#slide${currentSlide}`}
          className="btn btn-circle"
        >
          ❯
        </a>
      </div>
      <div className="flex flex-1 items-center justify-between">
        <span className="text-2xl p-2 text-white max-w-2xl line-clamp-1 lg:text-4xl">
          {game.title}
        </span>
        <div className="flex w-[300px] justify-between align-middle p-5">
          <div className="flex-1">very postive</div>
          <div className="flex-1">2</div>
          <div className="flex-none w-5 h-5">3</div>
        </div>
      </div>
    </div>
  );
};
export default RecommendationItem;
