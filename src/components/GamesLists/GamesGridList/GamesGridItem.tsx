import { Game } from "@/atoms/gamesAtom";
import moment from "moment";
import React, { useState } from "react";
import questionmark from "../../../../public/questionmark.png";
import Image from "next/image";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import ThumbsLike from "@/components/IndexPageContent/Recommendation/ThumbsLike";
import Link from "next/link";
import TagsCardList from "@/components/Tags/TagsCardList";

type GamesGridItemProps = {
  game: Game;
  userCollectionValue?: string;
  onCollect: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Game
  ) => Promise<boolean>;
  onSelectGame: (game: Game) => void;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Game,
    vote: number
  ) => Promise<boolean>;
};

const GamesGridItem: React.FC<GamesGridItemProps> = ({
  game,
  userCollectionValue,
  onCollect,
  onSelectGame,
  userVoteValue,
  onVote,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [like, setLike] = useState(false);

  return (
    <div className="flex">
      <Link href={`/games/${game.id}`}>
        <div className="card  bg-base-100 shadow-xl h-[30rem] w-80 hover:scale-105 transition-all ">
          <figure className="h-32 w-full items-start">
            {imageLoading && (
              <div className="flex w-full h-full items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            )}
            <Image
              src={game.coverImage ? game.coverImage : questionmark.src}
              alt="cover"
              className="w-full h-32 object-cover  rounded-lg cursor-pointer"
              width={100}
              height={100}
              onLoad={() => setImageLoading(false)}
            />
          </figure>
          <div className="card-body cursor-pointer flex flex-col h-48 m-0 p-1">
            <h2 className="card-title flex-1 text-xl justify-start top-0 align-top items-start line-clamp-2 min-h-[6rem]">
              {game.title.charAt(0).toUpperCase() + game.title.slice(1)}
            </h2>
            <span className="flex-1 text-slate-500">
              {game.createdAt &&
                `updated at ${moment(
                  new Date(game.createdAt.seconds * 1000)
                ).fromNow()}`}
            </span>
            <div className="flex flex-1">
              {game.tags && <TagsCardList tags={game.tags} />}
            </div>

            <ThumbsLike
              userVoteValue={userVoteValue}
              game={game}
              userCollectionValue={userCollectionValue}
              onCollect={onCollect}
              onVote={onVote}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};
export default GamesGridItem;
