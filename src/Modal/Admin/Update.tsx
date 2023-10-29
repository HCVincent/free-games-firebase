import { Game } from "@/atoms/gamesAtom";
import ImageUpload from "@/components/AdminPageContent/AddGames/ImageUpload";
import ImagesGroupUpload from "@/components/AdminPageContent/AddGames/ImagesGroupUpload";
import VideoUpload from "@/components/AdminPageContent/AddGames/VideoUpload";
import PlatformCheckbox from "@/components/PlatformTypes/PlatformCheckbox";
import TagsCheckboxList from "@/components/Tags/TagsCheckboxList";
import useGames from "@/hooks/useGames";
import useSelectFile from "@/hooks/useSelectFile";
import { allPlatformTypes } from "@/lib/constants";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";

type GameItemProps = {
  game: Game;
};

const Update: React.FC<GameItemProps> = ({ game }) => {
  const { gameStateValue } = useGames();
  const [tags, setTags] = useState<string[]>(game.tags || []);
  const [uploaded, setUploaded] = useState(false);
  const [uploadImages, setUploadImages] = useState(false);
  const [uploadTags, setUploadTags] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [addComplete, setAddComplete] = useState(false);
  const { onUpdateGame } = useGames();
  const [platformType, setPlatformType] = useState<string>(
    game.platformType || allPlatformTypes[0]
  );
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
      address: game.address,
      password: game.password,
    });
    if (game.tags) setTags(game.tags);
    if (game.coverImage) setSelectedImage(game.coverImage);
    if (game.video) setSelectedVideo(game.video);
    if (game.imagesGroup) setSelectedImagesGroup(game.imagesGroup);
    if (game.platformType) setPlatformType(game.platformType);
  }, [game]);

  const [textInputs, setTextInputs] = useState({
    title: game.title,
    description: game.body,
    address: game.address,
    password: game.password,
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
    const newGame: Game = {
      id: game.id,
      title: textInputs.title,
      body: textInputs.description,
      address: textInputs.address,
      voteStatus: game.voteStatus,
      recommend: false,
      updatedAt: serverTimestamp() as Timestamp,
      coverImage: selectedImage,
      video: selectedVideo,
      imagesGroup: selectedImagesGroup,
      tags: tags,
      platformType: platformType,
      password: textInputs.password,
    };

    setLoading(true);
    try {
      const success = await onUpdateGame("games", game, newGame, uploadImages);
      if (!success) {
        throw new Error("Failed to update game");
      } else {
        handleShowComplete();
        setTags([]);
        setLoading(false);
      }
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
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
      <div className="form-control w-full mt-4 text-white">
        <input
          required
          name="title"
          placeholder="title"
          className="input input-bordered "
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
        />{" "}
        <input
          name="address"
          placeholder="address"
          className="input input-bordered"
          onChange={onChange}
          value={textInputs.address || ""}
        />
        <input
          name="password"
          placeholder="password"
          className="input input-bordered"
          onChange={onChange}
          value={textInputs.password || ""}
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
        <div className="flex flex-col w-full text-white">
          <ImageUpload
            text="update"
            setUploaded={setUploaded}
            selectedImage={selectedImage}
            onSelectImage={onSelectImage}
            setSelectedImage={setSelectedImage}
          />
          <VideoUpload
            text="update"
            setUploaded={setUploaded}
            selectedVideo={selectedVideo}
            onSelectVideo={onSelectVideo}
            setSelectedVideo={setSelectedVideo}
          />
          <ImagesGroupUpload
            text="update"
            setUploaded={setUploaded}
            selectedImagesGroup={selectedImagesGroup}
            onSelectImagesGroup={onSelectImagesGroup}
            setSelectedImagesGroup={setSelectedImagesGroup}
          />
        </div>
      )}{" "}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Upload Tags?</span>
          <input
            onChange={() => setUploadTags(!uploadTags)}
            type="checkbox"
            checked={uploadTags}
            className="checkbox checkbox-primary"
          />
        </label>
      </div>
      {uploadTags && (
        <TagsCheckboxList
          gameTags={gameStateValue.gameTags}
          setTags={setTags}
          tags={tags}
        />
      )}
      <PlatformCheckbox
        allPlatformTypes={allPlatformTypes}
        setPlatformType={setPlatformType}
        platformType={platformType}
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
