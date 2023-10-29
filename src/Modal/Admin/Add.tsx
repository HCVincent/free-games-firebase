import { Game, GameTag } from "@/atoms/gamesAtom";
import ImageUpload from "@/components/AdminPageContent/AddGames/ImageUpload";
import ImagesGroupUpload from "@/components/AdminPageContent/AddGames/ImagesGroupUpload";
import VideoUpload from "@/components/AdminPageContent/AddGames/VideoUpload";
import PlatformCheckbox from "@/components/PlatformTypes/PlatformCheckbox";
import TagsCheckboxList from "@/components/Tags/TagsCheckboxList";
import { firestore, storage } from "@/firebase/clientApp";
import useGames from "@/hooks/useGames";
import useSelectFile from "@/hooks/useSelectFile";
import { allPlatformTypes } from "@/lib/constants";
import { arrayUnion } from "@firebase/firestore";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
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
  const [canAdd, setCanAdd] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [platformType, setPlatformType] = useState<string>(allPlatformTypes[0]);
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
    address: "",
    password: "",
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
        title: textInputs.title.toLowerCase(),
        body: textInputs.description,
        address: textInputs.address,
        recommend: false,
        voteStatus: 0,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        tags: tags,
        platformType: platformType,
        titleArray: textInputs.title.toLowerCase().split(" "),
        password: textInputs.password,
      };
      const gameDocRef = await addDoc(collection(firestore, "games"), newGame);
      const batch = writeBatch(firestore);
      newGame.id = gameDocRef.id;
      batch.update(gameDocRef, {
        id: gameDocRef.id,
      });

      if (tags && tags.length > 0) {
        for (let index = 0; index < tags.length; index++) {
          const tagDocRef = doc(firestore, "tags", tags[index]);
          batch.update(tagDocRef, {
            gameId: arrayUnion(newGame.id),
          });
        }
      }
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
      setTextInputs({ title: "", description: "", address: "", password: "" });
      setSelectedImage("");
      setSelectedVideo("");
      setSelectedImagesGroup([]);
      setTags([]);
      setPlatformType(allPlatformTypes[0]);
      setCanAdd(false);
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
    setCanAdd(true);
  };

  return (
    <div className="flex flex-col w-full items-start justify-start space-y-4">
      <div className="form-control w-full mt-4">
        <label htmlFor="title" className="block">
          Title
        </label>
        <input
          required
          id="title"
          name="title"
          placeholder="title"
          className="input input-bordered"
          value={textInputs.title}
          onChange={onChange}
        />

        <label htmlFor="description" className="block">
          Description
        </label>
        <textarea
          required
          id="description"
          name="description"
          placeholder="description"
          className="input input-bordered h-60 mt-4"
          onChange={onChange}
          value={textInputs.description}
        />

        <label htmlFor="address" className="block">
          Address
        </label>
        <input
          id="address"
          name="address"
          placeholder="address"
          className="input input-bordered"
          onChange={onChange}
          value={textInputs.address}
        />

        <label htmlFor="password" className="block">
          Password
        </label>
        <input
          id="password"
          name="password"
          placeholder="password"
          className="input input-bordered"
          onChange={onChange}
          value={textInputs.password}
        />
      </div>
      <ImageUpload
        text="add"
        selectedImage={selectedImage}
        onSelectImage={onSelectImage}
        setSelectedImage={setSelectedImage}
      />
      <VideoUpload
        text="add"
        selectedVideo={selectedVideo}
        onSelectVideo={onSelectVideo}
        setSelectedVideo={setSelectedVideo}
      />
      <ImagesGroupUpload
        text="add"
        selectedImagesGroup={selectedImagesGroup}
        onSelectImagesGroup={onSelectImagesGroup}
        setSelectedImagesGroup={setSelectedImagesGroup}
      />
      <PlatformCheckbox
        allPlatformTypes={allPlatformTypes}
        setPlatformType={setPlatformType}
        platformType={platformType}
      />
      <TagsCheckboxList
        gameTags={gameStateValue.gameTags}
        setTags={setTags}
        tags={tags}
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
          disabled={!canAdd}
        >
          {loading ? <span className="loading loading-spinner"></span> : "Add"}
        </button>
      </div>
      {error}
    </div>
  );
};
export default Add;
