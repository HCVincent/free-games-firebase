import Image from "next/image";
import React from "react";

type PropType = {
  selected: boolean;
  imgSrc: string;
  index: number;
  onClick: () => void;
};

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, imgSrc, index, onClick } = props;

  return (
    <div
      className={"flex w-full embla-thumbs__slide justify-center bg-black h-24".concat(
        selected ? " embla-thumbs__slide--selected " : ""
      )}
    >
      <button
        onClick={onClick}
        className="embla-thumbs__slide__button relative"
        type="button"
      >
        {/* <div className="embla-thumbs__slide__number absolute end-2 top-2 w-5 h-5 rounded-full bg-slate-900">
          <span className="text-slate-500">{index + 1}</span>
        </div> */}
        <Image
          className={`flex object-cover h-full w-auto embla-thumbs__slide__img  ${
            selected ? "" : "opacity-50"
          }`}
          src={imgSrc}
          width={436}
          height={219}
          alt={index.toString()}
        />
      </button>
    </div>
  );
};
