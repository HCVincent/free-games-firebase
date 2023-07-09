import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

type VideoUploadProps = {
  selectedVideo?: string;
  onSelectVideo: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedVideo: (value: string) => void;
};

const VideoUpload: React.FC<VideoUploadProps> = ({
  selectedVideo,
  onSelectVideo,
  setSelectedVideo,
}) => {
  const selectedVideoRef = useRef<HTMLInputElement>(null);
  const [play, setPlay] = useState(false);
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
            <div className="bg-white max-w-[200px] max-h-[150px]">
              <ReactPlayer
                url={selectedVideo}
                controls={true}
                playing={play}
                width="100%"
                height="100%"
              />
            </div>
            <button
              className="btn"
              onClick={() => {
                setSelectedVideo("");
              }}
            >
              remove
            </button>
          </>
        ) : (
          <>
            <button
              className="btn"
              onClick={() => {
                selectedVideoRef.current?.click();
              }}
            >
              Upload video
            </button>
            <input
              type="file"
              accept="video/mp4"
              ref={selectedVideoRef}
              hidden
              onChange={onSelectVideo}
            />
          </>
        )}
      </div>
    </div>
  );
};
export default VideoUpload;
