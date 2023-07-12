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
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadString,
} from "firebase/storage";
import React, { useEffect, useState } from "react";

type GameItemProps = {
  game: Game;
};

const Update: React.FC<GameItemProps> = ({ game }) => {
  const [uploaded, setUploaded] = useState(false);
  const [uploadImages, setUploadImages] = useState(false);
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

  useEffect(() => {
    setUploaded(false);
    setTextInputs({
      title: game.title,
      description: game.body,
    });
    if (game.coverImage) setSelectedImage(game.coverImage);
    if (game.video) setSelectedVideo(game.video);
    if (game.imagesGroup) setSelectedImagesGroup(game.imagesGroup);
  }, [game]);

  const [textInputs, setTextInputs] = useState({
    title: game.title,
    description: game.body,
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
        id: game.id,
        title: textInputs.title,
        body: textInputs.description,
        updatedAt: serverTimestamp() as Timestamp,
      };
      const gameDocRef = doc(firestore, "games", game?.id!);
      const batch = writeBatch(firestore);
      batch.update(gameDocRef, {
        title: newGame.title,
        body: newGame.body,
      });

      if (uploadImages) {
        if (selectedImage !== game.coverImage) {
          const coverImageRef = ref(storage, `games/${game.id}/coverImage`);
          listAll(coverImageRef)
            .then(async (listResults) => {
              const promises = listResults.items.map((item) => {
                return deleteObject(item);
              });
              await Promise.all(promises);
            })
            .catch((error) => {
              console.log("deleteStorageError", error);
            });
        }
        if (selectedImage !== "") {
          const coverImageRef = ref(
            storage,
            `games/${newGame.id}/coverImage/coverImage`
          );
          await uploadString(
            coverImageRef,
            selectedImage as string,
            "data_url"
          );
          const downloadURL = await getDownloadURL(coverImageRef);
          batch.update(gameDocRef, {
            coverImage: downloadURL,
          });
          newGame.coverImage = downloadURL;
        } else {
          batch.update(gameDocRef, {
            coverImage: "",
          });
          newGame.coverImage = "";
        }
      }

      // if (selectedImagesGroup && selectedImagesGroup.length > 0) {
      //   newGame.imagesGroup = [];
      //   for (let index = 0; index < selectedImagesGroup.length; index++) {
      //     const image = selectedImagesGroup[index];
      //     const imagesGroupRef = ref(
      //       storage,
      //       `games/${newGame.id}/imagesGroup/${index}`
      //     );
      //     await uploadString(imagesGroupRef, image as string, "data_url");
      //     const downloadURL = await getDownloadURL(imagesGroupRef);
      //     newGame.imagesGroup.unshift(downloadURL);
      //     batch.update(gameDocRef, {
      //       selectedImagesGroup: arrayUnion(downloadURL),
      //     });
      //   }
      // }

      // if (selectedVideo) {
      //   newGame.video = selectedVideo;
      //   const videoRef = ref(storage, `games/${newGame.id}/video/video`);
      //   await uploadString(videoRef, selectedVideo as string, "data_url");
      //   const downloadURL = await getDownloadURL(videoRef);
      //   batch.update(gameDocRef, {
      //     video: downloadURL,
      //   });
      //   newGame.video = downloadURL;
      // }

      await batch.commit();
      setGameStateValue((prev) => ({
        ...prev,
        games: [
          newGame,
          ...prev.games.filter((item) => item.id !== newGame.id),
        ],
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
    setUploaded(true);
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
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Upload images or videos?</span>
          <input
            onChange={() => setUploadImages(!uploadImages)}
            type="checkbox"
            checked={uploadImages}
            className="checkbox checkbox-primary"
          />
        </label>
      </div>
      {uploadImages && (
        <div className="flex flex-col w-full">
          <ImageUpload
            setUploaded={setUploaded}
            selectedImage={selectedImage}
            onSelectImage={onSelectImage}
            setSelectedImage={setSelectedImage}
          />
          <VideoUpload
            setUploaded={setUploaded}
            selectedVideo={selectedVideo}
            onSelectVideo={onSelectVideo}
            setSelectedVideo={setSelectedVideo}
          />
          <ImagesGroupUpload
            setUploaded={setUploaded}
            selectedImagesGroup={selectedImagesGroup}
            onSelectImagesGroup={onSelectImagesGroup}
            setSelectedImagesGroup={setSelectedImagesGroup}
          />
        </div>
      )}

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
          <span>Update Successfully</span>
        </div>
      )}
      <div className="flex w-full justify-end">
        <button
          disabled={!uploaded}
          className="btn btn-primary mt-4"
          onClick={(e) => {
            e.preventDefault;
            onSubmit();
          }}
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "UPDATE"
          )}
        </button>
      </div>
      {error}
    </div>
  );
};
export default Update;
