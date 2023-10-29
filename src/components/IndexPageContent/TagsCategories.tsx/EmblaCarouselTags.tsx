import React, { useState, useCallback, useEffect } from "react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Game } from "@/atoms/gamesAtom";
import useGames from "@/hooks/useGames";
import { useRouter } from "next/router";

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const EmblaCarouselTags: React.FC<PropType> = (props) => {
  const { onSelectGame, gameStateValue, onVote, onCollect } = useGames();
  const { slides, options } = props;
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options, [
    Autoplay({ stopOnInteraction: false }),
  ]);
  const router = useRouter();
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
  const images: string[] = [];

  const imageByIndex = (index: number): string => images[index % images.length];
  return (
    <div className="embla  h-[16rem]">
      <div className="embla__viewport" ref={emblaMainRef}>
        <div className="embla__container">
          {slides.map((string, index) => (
            <div className="" key={index}>
              <div className="embla__slide">
                <div className="card w-96 bg-base-100 shadow-xl hover:scale-105 transition-all">
                  <div className="card-body">
                    <h2
                      className="card-title items-center justify-center capitalize text-2xl cursor-pointer"
                      onClick={() => {
                        const tag = imageByIndex(string);
                        router.push(`/tags/${tag}`);
                      }}
                    >
                      {imageByIndex(string)}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarouselTags;
