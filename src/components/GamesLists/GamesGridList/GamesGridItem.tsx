import { Game, gameState } from "@/atoms/gamesAtom";
import ThumbsLike from "@/components/IndexPageContent/Recommendation/ThumbsLike";
import TagsCardList from "@/components/Tags/TagsCardList";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import questionmark from "../../../../public/questionmark.png";
const MomentSpan = dynamic(() => import("@/components/MomentSpan/MomentSpan"));
type GamesGridItemProps = {
  game: Game;
  userCollectionValue?: string;
  userVoteValue?: number;
};

const GamesGridItem: React.FC<GamesGridItemProps> = ({
  game,
  userCollectionValue,
  userVoteValue,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const setGameStateValue = useSetRecoilState(gameState);
  return (
    <div className="flex w-[28rem] hover:shadow-2xl">
      <Link
        target="_blank"
        href={`/games/${game.id}`}
        onClick={() => {
          setGameStateValue((prev) => ({
            ...prev,
            selectedGame: game,
          }));
        }}
        className="w-full"
      >
        <div className="card w-full bg-base-100 shadow-xl h-[34rem]  hover:scale-105 transition-all ">
          <figure className="h-52 w-full items-start">
            {imageLoading && (
              <div className="flex w-full h-full items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            )}
            <Image
              src={game.coverImage ? game.coverImage : questionmark.src}
              alt={"cover"}
              width={436}
              height={219}
              className={`${
                imageLoading ? "w-0" : "w-full"
              } object-cover rounded-lg cursor-pointer`}
              onLoad={() => setImageLoading(false)}
            />
          </figure>
          <div className="card-body cursor-pointer flex flex-col h-48 m-0 p-2">
            <h2 className="card-title  text-xl justify-start top-0 align-top items-start capitalize line-clamp-2 ml-2">
              {game.title}
            </h2>
            <MomentSpan timeStamp={game.updatedAt} />

            <div className="flex flex-1">
              {game.tags && <TagsCardList tags={game.tags} />}
            </div>

            <ThumbsLike
              userVoteValue={userVoteValue}
              game={game}
              userCollectionValue={userCollectionValue}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GamesGridItem;
