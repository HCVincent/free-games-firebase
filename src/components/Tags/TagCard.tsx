import { GameTag } from "@/atoms/gamesAtom";
import React from "react";

type TagCardProps = {
  tag: string;
};

const TagCard: React.FC<TagCardProps> = ({ tag }) => {
  return (
    <div className="card w-auto bg-base-100 shadow-xl mr-1 mt-1">
      <div className="card-body p-2 bg-slate-600 w-auto">
        <span className="text-xl text-slate-400 bg-slate-600 w-auto">
          {tag}
        </span>
      </div>
    </div>
  );
};
export default TagCard;
