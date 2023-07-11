import Image from "next/image";
import React, { useRef, useState } from "react";
import { TiDelete } from "react-icons/ti";

type ImagesGroupUploadProps = {
  selectedImagesGroup?: Array<string>;
  onSelectImagesGroup: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedImagesGroup: (value: Array<string>) => void;
};

const ImagesGroupUpload: React.FC<ImagesGroupUploadProps> = ({
  selectedImagesGroup,
  onSelectImagesGroup,
  setSelectedImagesGroup,
}) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col justify-start w-full">
      <div className="flex items-center mt-2 justify-between">
        <span>9 pictures at most(optional) :</span>
        {selectedImagesGroup && selectedImagesGroup.length > 0 ? (
          <div className="flex flex-wrap">
            {selectedImagesGroup.map((image, index) => (
              <div
                key={index}
                className="relative m-2"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Image
                  width={100}
                  height={200}
                  src={image}
                  alt={`Image ${index}`}
                  className={`border-spacing-1 border-gray-400 rounded-md max-h-20 object-cover ${
                    hoveredIndex === index ? "hover:border-slate-300" : ""
                  }`}
                />

                {hoveredIndex === index && (
                  <TiDelete
                    className="absolute top-0 right-0 z-10 hover:bg-slate-300"
                    onClick={() => {
                      const updatedImages = [...selectedImagesGroup];
                      updatedImages.splice(index, 1);
                      setSelectedImagesGroup(updatedImages);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <>
            <button
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                selectedFileRef.current?.click();
              }}
            >
              Upload images
            </button>
            <input
              type="file"
              multiple
              ref={selectedFileRef}
              hidden
              onChange={onSelectImagesGroup}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ImagesGroupUpload;
