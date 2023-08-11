import useGames from "@/hooks/useGames";
import { DocumentData, Query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import RecommendationItem from "./RecommendationItem";
import EmblaCarousel from "./EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel-react";

type RecommendationListsProps = {};
const OPTIONS: EmblaOptionsType = { loop: true };
const RecommendationLists: React.FC<RecommendationListsProps> = () => {
  const { readGames } = useGames();

  let next: Query<DocumentData>;
  const [loading, setLoading] = useState(false);
  const { onSelectGame, gameStateValue, setGameStateValue, onVote } =
    useGames();

  const handleOnReadGames = async () => {
    setLoading(true);
    try {
      await readGames("recommendations");
    } catch (error) {
      console.log("handleOnReadGames error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleOnReadGames();
  }, []);

  return (
    // <div className="carousel w-full mt-4 shadow-lg shadow-black rounded-lg">
    //   {gameStateValue.games.map((game, index) => (
    //     <RecommendationItem
    //       key={game.id}
    //       game={game}
    //       index={index}
    //       handlePrevSlide={handlePrevSlide}
    //       handleNextSlide={handleNextSlide}
    //       currentSlide={currentSlide}
    //       onSelectGame={onSelectGame}
    //       onVote={onVote}
    //       userVoteValue={
    //         gameStateValue.gameVotes.find((vote) => vote.gameId === game.id)
    //           ?.voteValue
    //       }
    //     />
    //   ))}
    // </div><section className="sandbox__carousel">

    <section className="sandbox__carousel">
      <EmblaCarousel slides={gameStateValue.games} options={OPTIONS} />
    </section>
  );
};
export default RecommendationLists;
