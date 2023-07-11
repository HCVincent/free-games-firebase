import { Game } from "@/atoms/gamesAtom";
import ImageUpload from "@/components/AdminPageContent/AddGames/ImageUpload";
import ImagesGroupUpload from "@/components/AdminPageContent/AddGames/ImagesGroupUpload";
import VideoUpload from "@/components/AdminPageContent/AddGames/VideoUpload";
import { firestore, storage } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import useSelectFile from "@/hooks/useSelectFile";
import { arrayUnion } from "@firebase/firestore";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useState } from "react";

type AddProps = {};

const Add: React.FC<AddProps> = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async () => {
    if (error) {
      setError("");
    }

    setLoading(true);
    try {
      const gameNewDocRef = doc(collection(firestore, "games"));
      const newGame: Game = {
        id: gameNewDocRef.id,
        title: textInputs.title,
        body: textInputs.description,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      };
      const gameDocRef = await addDoc(collection(firestore, "games"), newGame);
      const batch = writeBatch(firestore);

      if (selectedImage) {
        const coverImageRef = ref(
          storage,
          `games/${gameDocRef.id}/coverImage/coverImage`
        );
        console.log("selectedImage gameDocRef.id:", gameDocRef.id);
        await uploadString(coverImageRef, selectedImage as string, "data_url");
        const downloadURL = await getDownloadURL(coverImageRef);
        batch.update(gameDocRef, {
          coverImage: downloadURL,
        });
      }

      if (selectedImagesGroup && selectedImagesGroup.length > 0) {
        for (let index = 0; index < selectedImagesGroup.length; index++) {
          const image = selectedImagesGroup[index];
          const imagesGroupRef = ref(
            storage,
            `games/${gameDocRef.id}/imagesgroup/${index}`
          );
          console.log("selectedImagesGroup gameDocRef.id:", gameDocRef.id);
          await uploadString(imagesGroupRef, image as string, "data_url");
          const downloadURL = await getDownloadURL(imagesGroupRef);
          batch.update(gameDocRef, {
            selectedImagesGroup: arrayUnion(downloadURL),
          });
        }
      }

      if (selectedVideo) {
        const videoRef = ref(storage, `games/${gameDocRef.id}/video/video`);
        console.log("selectedVideo gameDocRef.id:", gameDocRef.id);
        await uploadString(videoRef, selectedVideo as string, "data_url");
        const downloadURL = await getDownloadURL(videoRef);
        batch.update(gameDocRef, {
          video: downloadURL,
        });
      }

      await batch.commit();
      router.reload();
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
