import Image from "next/image";
import React, { useRef, useState } from "react";
import { TiDelete } from "react-icons/ti";

type ImageUploadProps = {
  selectedImage?: string;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedImage: (value: string) => void;
  setUploaded: (value: boolean) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedImage,
  onSelectImage,
  setSelectedImage,
  setUploaded,
}) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const [isHover, setIsHover] = useState(false);
  return (
    <div className="flex flex-col justify-start w-full">
      <div className="flex items-center mt-2 justify-between">
        <span>cover image (optional) :</span>
        {selectedImage ? (
          <div
            className="relative"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <Image
              width={100}
              height={200}
              src={selectedImage}
              alt="cover"
              className="border-spacing-1 border-gray-400 rounded-md  top-0"
            />

            {isHover && (
              <TiDelete
                className="absolute top-0 right-0 z-10 hover:bg-slate-300"
                onClick={() => {
                  setUploaded(true);
                  setSelectedImage("");
                }}
              />
            )}
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
              Upload cover
            </button>
            <input
              type="file"
              ref={selectedFileRef}
              hidden
              onChange={(e) => {
                setUploaded(true);
                onSelectImage(e);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};
export default ImageUpload;
