import { Game, gameState } from "@/atoms/gamesAtom";
import Image from "next/image";
import React from "react";
import default_cover from "../../../../public/default_cover.png";
import Link from "next/link";
import { useSetRecoilState } from "recoil";
import dynamic from "next/dynamic";
const MomentSpan = dynamic(() => import("@/components/MomentSpan/MomentSpan"));
type RecommendationItemProps = {
  game: Game;
  index: number;
  onSelectGame: (game: Game) => void;

  userVoteValue?: number;
  userCollectionValue?: string;
};
const ThumbsLike = dynamic(() => import("./ThumbsLike"));
const RecommendationItem: React.FC<RecommendationItemProps> = ({
  game,
  index,
  userVoteValue,
  userCollectionValue,
}) => {
  const setGameStateValue = useSetRecoilState(gameState);
  return (
    <div
      id={`slide${index}`}
      className="embla__slide relative w-full h-[540px]  bg-slate-600 flex flex-col"
      key={game.id}
    >
      <div className="embla__slide__number">
        <span>{index + 1}</span>
      </div>
      <Link
        aria-label={`${game.title}`}
        href={`/games/${game.id}`}
        target="_blank"
        onClick={() => {
          setGameStateValue((prev) => ({
            ...prev,
            selectedGame: game,
          }));
        }}
        className="flex h-[480px] items-center bg-black align-middle justify-center "
      >
        <Image
          /* @ts-ignore */
          src={game.coverImage ? game.coverImage : default_cover}
          priority
          width={436}
          height={219}
          alt=""
          sizes="100vw"
          className="embla__slide__img inline-block object-cover lg:object-fill w-full h-auto lg:w-auto lg:h-full cursor-pointer"
        />
      </Link>

      <div className="flex flex-1 h-full items-center justify-between px-8">
        <div className="flex items-end p-2">
          <span className="text-2xl  text-white  line-clamp-2 lg:line-clamp-1 lg:text-4xl capitalize">
            {game.title}
          </span>
          <MomentSpan timeStamp={game.updatedAt} />
        </div>
        <div className="flex-col flex-0 min-w-[20rem] hidden lg:flex">
          <ThumbsLike
            userVoteValue={userVoteValue}
            game={game}
            userCollectionValue={userCollectionValue}
          />
        </div>
      </div>
    </div>
  );
};
export default RecommendationItem;
