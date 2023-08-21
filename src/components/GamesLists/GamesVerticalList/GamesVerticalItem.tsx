import { Game } from "@/atoms/gamesAtom";
import moment from "moment";
import React, { useState } from "react";
import questionmark from "../../../../public/questionmark.png";
import Image from "next/image";
import { FaRegHeart, FaHeart } from "react-icons/fa";

type GamesVerticalItemProps = {
  game: Game;
  userCollectionValue?: string;
  onCollect: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Game
  ) => Promise<boolean>;
  onSelectGame: (game: Game) => void;
};

const GamesVerticalItem: React.FC<GamesVerticalItemProps> = ({
  game,
  userCollectionValue,
  onCollect,
  onSelectGame,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [like, setLike] = useState(false);
  return (
    <div className="card card-side bg-base-100 shadow-xl m-8 p-2 hover:scale-105 transition-all ">
      <figure>
        {imageLoading && (
          <div className="flex w-full h-full items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
        <Image
          src={game.coverImage ? game.coverImage : questionmark.src}
          alt="cover"
          className="w-full object-cover rounded-lg "
          width={100}
          height={50}
          onLoad={() => setImageLoading(false)}
        />
      </figure>
      <div
        className="card-body cursor-pointer"
        onClick={() => {
          onSelectGame(game);
        }}
      >
        <h2 className="card-title">{game.title}</h2>
        <p>
          {game.createdAt &&
            `updated at ${moment(
              new Date(game.createdAt.seconds * 1000)
            ).fromNow()}`}
        </p>
        <div className="card-actions justify-end">
          <button
            className="flex text-white w-12 h-12 transition-all hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              setLike(!like);
            }}
          >
            {userCollectionValue === game.id ? (
              <FaHeart
                className="w-12 h-12 items-end"
                onClick={(e) => onCollect(e, game)}
              />
            ) : (
              <FaRegHeart
                className="w-12 h-12"
                onClick={(e) => onCollect(e, game)}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default GamesVerticalItem;
