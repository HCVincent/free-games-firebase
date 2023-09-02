import { Game, GameTag } from "@/atoms/gamesAtom";
import React, { useState, useEffect } from "react";

type TagCheckboxProps = {
  tag: GameTag;
  setTags: (tag: string[]) => void;
  tags: string[];
  isChecked?: boolean;
};

const TagCheckbox: React.FC<TagCheckboxProps> = ({
  tag,
  setTags,
  tags,
  isChecked,
}) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (check: boolean) => {
    setChecked(check);
    if (check) {
      setTags([...tags, tag.title]);
    } else {
      setTags(tags.filter((prev) => prev !== tag.title));
    }
  };
  useEffect(() => {
    if (isChecked) {
      setChecked(isChecked);
    } else {
      setChecked(false);
    }
  }, [isChecked]);
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{tag.title}</span>
        <input
          type="checkbox"
          checked={checked}
          className="checkbox checkbox-primary"
          onChange={() => handleChange(!checked)}
        />
      </label>
    </div>
  );
};
export default TagCheckbox;
