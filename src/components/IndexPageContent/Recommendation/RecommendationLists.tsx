import useGames from "@/hooks/useGames";
import { EmblaOptionsType } from "embla-carousel-react";
import React, { useState } from "react";
import EmblaCarousel from "./EmblaCarousel";
import { useRecoilValue } from "recoil";
import { gameState } from "@/atoms/gamesAtom";

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
