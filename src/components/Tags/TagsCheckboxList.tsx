import React from "react";
import TagCheckbox from "./TagCheckbox";
import { Game, GameTag } from "@/atoms/gamesAtom";

type TagsCheckboxListProps = {
  gameTags: GameTag[];
  setTags: (tag: string[]) => void;
  tags: string[];
};

const TagsCheckboxList: React.FC<TagsCheckboxListProps> = ({
  gameTags,
  setTags,
  tags,
}) => {
  return (
    <div className="flex flex-col ">
      <span className="text-white">tags:</span>
      <div className="grid grid-cols-4">
        {gameTags.map((tag) => (
          <TagCheckbox
            tag={tag}
            key={tag.id}
            setTags={setTags}
            tags={tags}
            isChecked={tags && tags.length > 0 ? tags?.includes(tag.id) : false}
          ></TagCheckbox>
        ))}
      </div>
    </div>
  );
};
export default TagsCheckboxList;
