import React, { useState } from "react";

const useSelectFile = () => {
  const [selectedImage, setSelectedImage] = useState<string>();
  const [selectedImagesGroup, setSelectedImagesGroup] =
    useState<Array<string>>();
  const [selectedVideo, setSelectedVideo] = useState<string>();

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedImage(readerEvent.target?.result as string);
    };
  };

  const onSelectImagesGroup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const readerPromises: Promise<string>[] = [];

      // Iterate through the selected files
      for (let i = 0; i < Math.min(9, files.length); i++) {
        const file = files[i];
        const reader = new FileReader();

        // Create a promise that resolves when the reader has finished loading the image
        const readerPromise = new Promise<string>((resolve) => {
          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              resolve("");
            }
          };
        });
        reader.readAsDataURL(file);
        readerPromises.push(readerPromise);
      }

      // Wait for all the promises to resolve and update the state with the selected images
      Promise.all(readerPromises).then((results) => {
        setSelectedImagesGroup(results.filter((result) => result !== ""));
      });
    }
  };

  const onSelectVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedVideo(readerEvent.target?.result as string);
    };
  };

  return {
    selectedImage,
    setSelectedImage,
    onSelectImage,
    selectedVideo,
    setSelectedVideo,
    onSelectVideo,
    onSelectImagesGroup,
    selectedImagesGroup,
    setSelectedImagesGroup,
  };
};
export default useSelectFile;
