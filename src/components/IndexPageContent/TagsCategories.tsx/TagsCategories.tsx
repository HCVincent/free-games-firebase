import React from "react";
import EmblaCarouselTags from "./EmblaCarouselTags";
import { EmblaOptionsType } from "embla-carousel-react";
import { useRouter } from "next/router";
type TagsCategoriesProps = {};
const OPTIONS: EmblaOptionsType = {
  slidesToScroll: "auto",
  containScroll: "trimSnaps",
};
const SLIDE_COUNT = 8;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
const TagsCategories: React.FC<TagsCategoriesProps> = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col w-full bg-base-300 h-[16rem] rounded-3xl mt-16">
      <h2
        className="text-4xl px-6 py-2 cursor-pointer transition-all hover:scale-105 w-[20rem] h-auto"
        onClick={() => {
          router.push(`/tags`);
        }}
      >
        All Tags
      </h2>
      <EmblaCarouselTags slides={SLIDES} options={OPTIONS} />
    </div>
  );
};
export default TagsCategories;
