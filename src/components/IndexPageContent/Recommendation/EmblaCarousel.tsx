import React, { useState, useCallback, useEffect } from "react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Game } from "@/atoms/gamesAtom";
import RecommendationItem from "./RecommendationItem";
import useGames from "@/hooks/useGames";
import { Thumb } from "./EmblaCarouselThumbsButton";

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
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options, [
    Autoplay({ stopOnInteraction: false }),
  ]);
  const [emblaRef] = useEmblaCarousel(options, [
    Autoplay({ stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );
  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    //
    <div className="embla hover:scale-105 transition-all">
      <div className="embla__viewport" ref={emblaMainRef}>
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
              userCollectionValue={
                gameStateValue.gameCollections.find(
                  (collection) => collection.gameId === game.id
                )?.gameId
              }
            />
          ))}
        </div>
        <div className="embla-thumbs flex h-20 lg:h-40 w-full">
          <div className="embla-thumbs__viewport w-full" ref={emblaThumbsRef}>
            <div className="embla-thumbs__container flex w-full">
              {slides.map((game, index) => (
                <Thumb
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  index={index}
                  imgSrc={game.coverImage!}
                  key={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
