import Link from "next/link";
import React from "react";

type TagCardProps = {
  tag: string;
};

const TagCard: React.FC<TagCardProps> = ({ tag }) => {
  return (
    <div className="card w-auto shadow-xl   ">
      <div className="card-body w-auto m-0 p-1">
        <Link
          className="text-xl text-slate-400  w-auto m-0"
          href={`/tags/${tag}`}
        >
          <button className="btn  w-auto p-0 px-2 m-0">{tag}</button>
        </Link>
      </div>
    </div>
  );
};
export default TagCard;
