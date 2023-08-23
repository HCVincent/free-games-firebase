import Image from "next/image";
import React from "react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
type GameCoverProps = {
  coverImage?: string;
  imagesGroup?: string[];
};
import defaultCover from "../../../public/default_cover.png";

const GameCover: React.FC<GameCoverProps> = ({ coverImage, imagesGroup }) => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ stopOnInteraction: false }),
  ]);
  return (
    <div>
      {imagesGroup ? (
        <div className="embla  hover:scale-105 transition-all p-0 mt-10">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {imagesGroup.map((image, index) => (
                <Image
                  alt={`image${index}`}
                  key={index}
                  src={image}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="flex object-cover w-full h-[480px] cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Image
          alt="cover"
          src={coverImage ? coverImage : defaultCover}
          width={0}
          height={0}
          sizes="100vw"
          className="flex object-cover w-full h-[480px] cursor-pointer"
        ></Image>
      )}
    </div>
  );
};
export default GameCover;
