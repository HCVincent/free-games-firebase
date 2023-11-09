import { Game } from "@/atoms/gamesAtom";
import { firestore } from "@/firebase/clientApp";
import useGames from "@/hooks/useGames";
import Update from "@/Modal/Admin/Update";
import Image from "next/image";
import { doc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import default_cover from "../../../../public/default_cover.png";

type GameItemProps = {
  game: Game;
};

const GameItem: React.FC<GameItemProps> = ({ game }) => {
  const { onUpdateGameRec } = useGames();
  const [recommend, setRecommend] = useState(game.recommend);
  const [loading, setLoading] = useState(false);
  const { onDeleteGame, onSelectGame, gameStateValue } = useGames();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const handleDelete = () => {
    setDeleteLoading(true);
    onDeleteGame("games", game);
    setDeleteLoading(false);
  };
  const handleRecommend = async () => {
    if (error) {
      setError("");
    }
    setLoading(true);
    try {
      const successUpdate = await onUpdateGameRec(
        "games",
        game.id!,
        !recommend
      );
      if (recommend) {
        onDeleteGame("recommendations", game);
      } else {
        const newGame: Game = {
          id: game.id,
          title: game.title,
          address: game.address ? game.address : "",
          body: game.body,
          voteStatus: game.voteStatus ? game.voteStatus : 0,
          coverImage: game.coverImage ? game.coverImage : "",
          video: game.video ? game.video : "",
          imagesGroup: game.imagesGroup ? game.imagesGroup : [],
          recommend: true,
          tags: game.tags,
          platformType: game.platformType,
          createdAt: serverTimestamp() as Timestamp,
          updatedAt: serverTimestamp() as Timestamp,
        };
        const docRef = doc(firestore, "recommendations", game.id!);
        await setDoc(docRef, newGame);
      }
      if (!successUpdate) {
        throw new Error("Failed to update game");
      } else {
        setRecommend(!recommend);
        setLoading(false);
      }
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center">
      <div className="card w-56 bg-base-100 shadow-xl ">
        <figure className="h-full">
          <div className="flex w-full h-24 items-start justify-start">
            {imageLoading && (
              <div className="flex w-full h-full items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            )}
            <Image
              alt={game.title}
              src={game.coverImage ? game.coverImage : default_cover.src}
              width={436}
              height={219}
              className={`${
                imageLoading ? "w-0" : "w-full"
              } object-cover rounded-lg`}
              onLoad={() => setImageLoading(false)}
            />
          </div>
        </figure>
        <div className="card-body w-full p-2  ">
          <h2 className="text-xs capitalize">{game.title}</h2>
          {game.createdAt && (
            <span className="text-xs text-slate-700">
              {moment(new Date(game.createdAt?.seconds * 1000)).fromNow()}
            </span>
          )}
          <button className="btn text-xs" onClick={() => handleRecommend()}>
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <span
                className={`text-xs ${
                  recommend ? "text-red-400 " : "text-green-400"
                }`}
              >
                {`${recommend ? "remove from ll" : "add on rcm games "}`}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default GameItem;
