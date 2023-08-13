import React, { useState } from "react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Game } from "@/atoms/gamesAtom";
import RecommendationItem from "./RecommendationItem";
import useGames from "@/hooks/useGames";

type PropType = {
  slides: Game[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { onSelectGame, gameStateValue, onVote, onCollect } = useGames();
  const handlePrevSlide = () => {};

  const handleNextSlide = () => {};
  const { slides, options } = props;
  const [emblaRef] = useEmblaCarousel(options, [Autoplay()]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((game, index) => (
            <RecommendationItem
              key={game.id}
              game={game}
              index={index}
              handlePrevSlide={handlePrevSlide}
              handleNextSlide={handleNextSlide}
              currentSlide={currentSlide}
              onSelectGame={onSelectGame}
              onVote={onVote}
              onCollect={onCollect}
              userVoteValue={
                gameStateValue.gameVotes.find((vote) => vote.gameId === game.id)
                  ?.voteValue
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
