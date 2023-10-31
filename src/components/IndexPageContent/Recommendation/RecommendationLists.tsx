import { EmblaOptionsType } from "embla-carousel-react";
import React from "react";
import EmblaCarousel from "./EmblaCarousel";

type RecommendationListsProps = {};
const OPTIONS: EmblaOptionsType = { loop: true };

const RecommendationLists: React.FC<RecommendationListsProps> = () => {
  return (
    <section className="sandbox__carousel mt-10">
      <EmblaCarousel slides={[]} options={OPTIONS} />
    </section>
  );
};

export default RecommendationLists;
