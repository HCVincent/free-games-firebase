import React, { useRef, useState } from "react";
import { TiDelete } from "react-icons/ti";
import ReactPlayer from "react-player";

type VideoUploadProps = {
  selectedVideo?: string;
  onSelectVideo: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedVideo: (value: string) => void;
  setUploaded?: (value: boolean) => void;
  text: "add" | "update";
};

const VideoUpload: React.FC<VideoUploadProps> = ({
  selectedVideo,
  onSelectVideo,
  setSelectedVideo,
  setUploaded,
  text,
}) => {
  const selectedVideoRef = useRef<HTMLInputElement>(null);
  const [play, setPlay] = useState(false);
  const [isHover, setIsHover] = useState(false);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      setPlay(false);
    }
  });
  return (
    <div className="flex flex-col justify-start w-full">
      <div className="flex items-center mt-2 justify-between">
        <span>video (optional) :</span>
        {selectedVideo ? (
          <>
            <div
              className="relative max-w-[200px] max-h-[150px]"
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              <ReactPlayer
                url={selectedVideo}
                controls={true}
                playing={play}
                width="100%"
                height="100%"
              />
              {isHover && (
                <TiDelete
                  className="absolute top-0 right-0 z-10 hover:bg-slate-300"
                  onClick={() => {
                    {
                      setUploaded && setUploaded(true);
                    }
                    setSelectedVideo("");
                  }}
                />
              )}
            </div>
          </>
        ) : (
          <>
            <button
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                selectedVideoRef.current?.click();
              }}
            >
              {text} video
            </button>
            <input
              type="file"
              accept="video/mp4"
              ref={selectedVideoRef}
              hidden
              onChange={(e) => {
                {
                  setUploaded && setUploaded(true);
                }
                onSelectVideo(e);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};
export default VideoUpload;
