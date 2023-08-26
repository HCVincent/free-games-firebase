import { Game } from "@/atoms/gamesAtom";
import React, { useState } from "react";
import Image from "next/image";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import moment from "moment";
type RecommendationItemProps = {
  game: Game;
  index: number;
  handlePrevSlide: () => void;
  handleNextSlide: () => void;
  onSelectGame: (game: Game) => void;
  currentSlide: number;
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
  handlePrevSlide,
  handleNextSlide,
  currentSlide,
  onSelectGame,
  onVote,
  onCollect,
  userVoteValue,
  userCollectionValue,
}) => {
  const [like, setLike] = useState(false);
  const [loadingUpVote, setLoadingUpVote] = useState(false);
  const [loadingDownVote, setLoadingDownVote] = useState(false);
  const [error, setError] = useState(false);
  const handleVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    vote: number
  ) => {
    vote === 1 ? setLoadingUpVote(true) : setLoadingDownVote(true);

    try {
      const success = await onVote(event, game, vote);
      if (!success) {
        throw new Error("Failed to vote post");
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoadingUpVote(false);
    setLoadingDownVote(false);
  };
  return (
    <div
      id={`slide${index}`}
      className="embla__slide relative w-full h-[540px]  bg-slate-600 flex flex-col"
      key={game.id}
    >
      <div className="embla__slide__number">
        <span>{index + 1}</span>
      </div>
      <Image
        /* @ts-ignore */
        src={game.coverImage}
        alt=""
        width={0}
        height={0}
        sizes="100vw"
        className="embla__slide__img flex object-cover w-full h-[480px] cursor-pointer"
        onClick={() => {
          onSelectGame(game);
        }}
      />

      <div className="flex flex-1 h-full items-center justify-between px-8">
        <div className="flex items-end p-2">
          <span className="text-xl  text-white max-w-2xl line-clamp-1 lg:text-4xl">
            {game.title}
          </span>
          <span className="ml-2">
            updated at{" "}
            {game.createdAt &&
              moment(new Date(game.createdAt.seconds * 1000)).fromNow()}
          </span>
        </div>
        <div className="flex w-[240px] h-full justify-between align-middle p-2 text-xl">
          <div className="flex flex-1 justify-between px-2 items-center">
            {loadingUpVote ? (
              <span className="flex loading loading-spinner"></span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`flex w-12 h-12 ${
                  userVoteValue === 1 ? "text-blue-500" : "text-gray-500"
                } cursor-pointer`}
                onClick={(event) => handleVote(event, 1)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                />
              </svg>
            )}

            <span className="flex text-4xl p-4">
              {game.voteStatus ? game.voteStatus : 0}
            </span>
            {loadingDownVote ? (
              <span className="flex loading loading-spinner"></span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`flex w-12 h-12 ${
                  userVoteValue === -1 ? "text-red-500" : "text-gray-500"
                } cursor-pointer`}
                onClick={(event) => handleVote(event, -1)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
                />
              </svg>
            )}
          </div>
          <button
            className="flex flex-1 text-white justify-center items-center transition-all hover:scale-110"
            onClick={() => setLike(!like)}
          >
            {userCollectionValue === game.id ? (
              <FaHeart
                className="w-12 h-12"
                onClick={(e) => onCollect(e, game)}
              />
            ) : (
              <FaRegHeart
                className="w-12 h-12"
                onClick={(e) => onCollect(e, game)}
              />
            )}
          </button>
          {/* <div className="flex flex-1  align-middle items-center justify-center text-white cursor-pointer hover:bg-slate-800 hover:rounded">
            {game.address && (
              <a href={game.address}>
                <AiOutlineDownload className="w-12 h-12" />
              </a>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};
export default RecommendationItem;
