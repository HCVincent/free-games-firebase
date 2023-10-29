import React from "react";
import { Game, GameTag } from "@/atoms/gamesAtom";

type PlatformCheckboxProps = {
  allPlatformTypes: string[];
  setPlatformType: (tag: string) => void;
  platformType: string;
};

const PlatformCheckbox: React.FC<PlatformCheckboxProps> = ({
  allPlatformTypes,
  setPlatformType,
  platformType,
}) => {
  return (
    <div className="flex flex-col ">
      <label className="">types:</label>
      <div className="grid grid-cols-2">
        {allPlatformTypes.map((tag, index) => (
          <label key={index} className="flex items-center">
            <input
              type="radio"
              name="platformType"
              value={tag}
              checked={platformType === tag}
              onChange={() => setPlatformType(tag)}
              className="radio radio-primary"
            />
            <p className="ml-2">{tag}</p>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PlatformCheckbox;
