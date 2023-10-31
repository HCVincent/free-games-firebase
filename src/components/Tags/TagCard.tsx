import Link from "next/link";
import React from "react";

type TagCardProps = {
  tag: string;
};

const TagCard: React.FC<TagCardProps> = ({ tag }) => {
  return (
    <div
      aria-label={tag}
      className="flex max-w-[14rem] h-14 m-1 text-lg text-slate-400 w-auto btn capitalize"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        window.open(`/tags/${tag}`, "_blank");
      }}
    >
      {tag}
    </div>
  );
};
export default TagCard;
