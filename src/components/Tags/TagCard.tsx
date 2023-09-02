import { GameTag } from "@/atoms/gamesAtom";
import React from "react";

type TagCardProps = {
  tag: GameTag;
};

const TagCard: React.FC<TagCardProps> = ({ tag }) => {
  return (
    <div className="card w-auto bg-base-100 shadow-xl">
      <div className="card-body">
        <p className="text-2xl">{tag.title}</p>
      </div>
    </div>
  );
};
export default TagCard;
