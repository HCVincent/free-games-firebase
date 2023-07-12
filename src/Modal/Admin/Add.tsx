import { Game } from "@/atoms/gamesAtom";
import ImageUpload from "@/components/AdminPageContent/AddGames/ImageUpload";
import ImagesGroupUpload from "@/components/AdminPageContent/AddGames/ImagesGroupUpload";
import VideoUpload from "@/components/AdminPageContent/AddGames/VideoUpload";
import { firestore, storage } from "@/firebase/clientApp";
import useGames from "@/hooks/useGames";
import useSelectFile from "@/hooks/useSelectFile";
import { arrayUnion } from "@firebase/firestore";
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useState } from "react";

type AddProps = {};

const Add: React.FC<AddProps> = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [addComplete, setAddComplete] = useState(false);
  const { gameStateValue, setGameStateValue } = useGames();
  const {
    selectedImage,
    setSelectedImage,
    onSelectImage,
    selectedVideo,
    setSelectedVideo,
    onSelectVideo,
    onSelectImagesGroup,
    selectedImagesGroup,
    setSelectedImagesGroup,
  } = useSelectFile();
  const [textInputs, setTextInputs] = useState({
    title: "",
    description: "",
  });
  const handleShowComplete = () => {
    setAddComplete(true);
    setTimeout(() => {
      setAddComplete(false);
    }, 2000);
  };

  const onSubmit = async () => {
    if (error) {
      setError("");
    }

    setLoading(true);
    try {
      const newGame: Game = {
        title: textInputs.title,
        body: textInputs.description,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      };
      const gameDocRef = await addDoc(collection(firestore, "games"), newGame);
      const batch = writeBatch(firestore);
      newGame.id = gameDocRef.id;
      batch.update(gameDocRef, {
        id: gameDocRef.id,
      });

      if (selectedImage) {
        const coverImageRef = ref(
          storage,
          `games/${newGame.id}/coverImage/coverImage`
        );
        await uploadString(coverImageRef, selectedImage as string, "data_url");
        const downloadURL = await getDownloadURL(coverImageRef);
        batch.update(gameDocRef, {
          coverImage: downloadURL,
        });
        newGame.coverImage = downloadURL;
      }

      if (selectedImagesGroup && selectedImagesGroup.length > 0) {
        newGame.imagesGroup = [];
        for (let index = 0; index < selectedImagesGroup.length; index++) {
          const image = selectedImagesGroup[index];
          const imagesGroupRef = ref(
            storage,
            `games/${newGame.id}/imagesGroup/${index}`
          );
          await uploadString(imagesGroupRef, image as string, "data_url");
          const downloadURL = await getDownloadURL(imagesGroupRef);
          newGame.imagesGroup.unshift(downloadURL);
          batch.update(gameDocRef, {
            imagesGroup: arrayUnion(downloadURL),
          });
        }
      }

      if (selectedVideo) {
        newGame.video = selectedVideo;
        const videoRef = ref(storage, `games/${newGame.id}/video/video`);
        await uploadString(videoRef, selectedVideo as string, "data_url");
        const downloadURL = await getDownloadURL(videoRef);
        batch.update(gameDocRef, {
          video: downloadURL,
        });
        newGame.video = downloadURL;
      }

      await batch.commit();
      setGameStateValue((prev) => ({
        ...prev,
        games: [newGame, ...prev.games],
      }));
      handleShowComplete();
    } catch (error: any) {
      console.log("handleUploadGame error", error.message);
      setError(error);
    }

    setLoading(false);
  };

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col w-full items-start justify-start">
      <div className="form-control w-full mt-4">
        <input
          required
          name="title"
          placeholder="title"
          className="input input-bordered"
          value={textInputs.title}
          onChange={onChange}
        />
        <textarea
          required
          name="description"
          placeholder="description"
          className="input input-bordered h-60 mt-4"
          onChange={onChange}
          value={textInputs.description}
        />
      </div>
      <ImageUpload
        selectedImage={selectedImage}
        onSelectImage={onSelectImage}
        setSelectedImage={setSelectedImage}
      />
      <VideoUpload
        selectedVideo={selectedVideo}
        onSelectVideo={onSelectVideo}
        setSelectedVideo={setSelectedVideo}
      />
      <ImagesGroupUpload
        selectedImagesGroup={selectedImagesGroup}
        onSelectImagesGroup={onSelectImagesGroup}
        setSelectedImagesGroup={setSelectedImagesGroup}
      />

      {addComplete && (
        <div className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Add Successfully</span>
        </div>
      )}
      <div className="flex w-full justify-end">
        <button
          className="btn btn-primary mt-4"
          onClick={(e) => {
            e.preventDefault;
            onSubmit();
          }}
        >
          {loading ? <span className="loading loading-spinner"></span> : "Add"}
        </button>
      </div>
      {error}
    </div>
  );
};
export default Add;
