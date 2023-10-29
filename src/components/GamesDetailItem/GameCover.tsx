import Image from "next/image";
import React, { useCallback, useState } from "react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import ImageViewer from "react-simple-image-viewer";
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

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const openImageViewer = useCallback((index: number) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };
  return (
    <div className="w-full h-[420px]">
      {imagesGroup && imagesGroup.length > 0 ? (
        <div className="embla   p-0 ">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container ">
              <Image
                alt="cover"
                src={coverImage ? coverImage : defaultCover}
                priority
                width={300}
                height={200}
                sizes="100vw"
                className="flex object-cover w-full h-[420px] cursor-pointer rounded-md"
              ></Image>

              {imagesGroup.map((image, index) => (
                <Image
                  key={index}
                  priority
                  alt={`image${index}`}
                  onClick={() => openImageViewer(index)}
                  src={image}
                  width={300}
                  height={200}
                  sizes="100vw"
                  className="flex  w-[800px] h-[420px] cursor-pointer rounded-md"
                />
              ))}
            </div>
          </div>
          {isViewerOpen && (
            <div className="relative z-50">
              <ImageViewer
                src={imagesGroup}
                currentIndex={currentImage}
                disableScroll={false}
                closeOnClickOutside={true}
                onClose={closeImageViewer}
              />
            </div>
          )}
        </div>
      ) : (
        <Image
          alt="cover"
          src={coverImage ? coverImage : defaultCover}
          width={500}
          height={500}
          sizes="100vw"
          className="flex object-cover w-full h-[420px] cursor-pointer rounded-md"
        ></Image>
      )}
    </div>
  );
};
export default GameCover;
