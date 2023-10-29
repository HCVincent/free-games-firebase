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
type GamesVerticalItemProps = {
  game: Game;
  userVoteValue?: number;
  userCollectionValue?: string;

  onSelectGame: (game: Game) => void;
};

const GamesVerticalItem: React.FC<GamesVerticalItemProps> = ({
  game,
  userCollectionValue,
  onSelectGame,
  userVoteValue,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [like, setLike] = useState(false);
  const setGameStateValue = useSetRecoilState(gameState);
  return (
    <Link
      href={`/games/${game.id}`}
      onClick={() => {
        setGameStateValue((prev) => ({
          ...prev,
          selectedGame: game,
        }));
      }}
      className="card card-side bg-base-100 shadow-xl m-8 p-2 hover:scale-105 transition-all "
    >
      <figure className="flex flex-1 bg-black  ">
        {imageLoading && (
          <div className="flex w-full h-full items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        <Image
          src={game.coverImage ? game.coverImage : questionmark.src}
          alt={`cover${game.id}`}
          priority
          className="rounded-lg"
          width={200}
          height={200}
          onLoad={() => setImageLoading(false)}
        />
      </figure>{" "}
      <div className="flex flex-1 flex-col">
        {game.tags && <TagsCardList tags={game.tags} />}
        <div className="card-body cursor-pointer flex flex-1">
          <h2 className="card-title capitalize">{game.title}</h2>
          <MomentSpan timeStamp={game.updatedAt} />
          <div className="card-actions justify-end">
            <ThumbsLike
              userVoteValue={userVoteValue}
              game={game}
              userCollectionValue={userCollectionValue}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};
export default GamesVerticalItem;
