import React from "react";
import TagCard from "./TagCard";

type TagsCardListProps = {
  tags: string[];
};

const TagsCardList: React.FC<TagsCardListProps> = ({ tags }) => {
  return (
    <div className="flex flex-wrap max-h-30 overflow-hidden">
      {tags.map((tag) => (
        <TagCard tag={tag} key={tag}></TagCard>
      ))}
    </div>
  );
};
export default TagsCardList;
