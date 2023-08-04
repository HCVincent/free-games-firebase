import useGames from "@/hooks/useGames";
import { DocumentData, Query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import RecommendationItem from "./RecommendationItem";

type RecommendationListsProps = {};

const RecommendationLists: React.FC<RecommendationListsProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  let next: Query<DocumentData>;
  const { readGames } = useGames();
  const [loading, setLoading] = useState(false);
  const { onSelectGame, gameStateValue, setGameStateValue, onVote } =
    useGames();

  const handleOnReadGames = async () => {
    setLoading(true);
    try {
      await readGames("games");
    } catch (error) {
      console.log("handleOnReadGames error", error);
    }
    setLoading(false);
  };
  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? gameStateValue.games.length - 1 : prevSlide - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === gameStateValue.games.length - 1 ? 0 : prevSlide + 1
    );
  };

  useEffect(() => {
    handleOnReadGames();
  }, []);

  return (
    <div className="carousel w-full mt-4 shadow-lg shadow-black rounded-lg">
      {gameStateValue.games.map((game, index) => (
        <RecommendationItem
          key={game.id}
          game={game}
          index={index}
          handlePrevSlide={handlePrevSlide}
          handleNextSlide={handleNextSlide}
          currentSlide={currentSlide}
          onSelectGame={onSelectGame}
          onVote={onVote}
          userVoteValue={
            gameStateValue.gameVotes.find((vote) => vote.gameId === game.id)
              ?.voteValue
          }
        />
      ))}
    </div>
  );
};
export default RecommendationLists;
