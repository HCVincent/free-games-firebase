import ImageUpload from "@/components/AdminPageContent/AddGames/ImageUpload";
import ImagesGroupUpload from "@/components/AdminPageContent/AddGames/ImagesGroupUpload";
import VideoUpload from "@/components/AdminPageContent/AddGames/VideoUpload";
import useSelectFile from "@/hooks/useSelectFile";
import React, { useState } from "react";

type AddProps = {};

const Add: React.FC<AddProps> = () => {
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

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) {
      setError("");
    }
    setLoading(true);
    // try {
    //   // await signInWithEmailAndPassword(loginForm.email, loginForm.password);
    // } catch (error: any) {
    //   setError(error);
    //   console.log("signInWithEmailAndPassword Error", error);
    // }
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
      <form className="w-full" onSubmit={onSubmit}>
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
        <div className="flex justify-end">
          <button className="btn btn-primary mt-4" type="submit">
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Add"
            )}
          </button>
        </div>
      </form>
      {/* {error ||
        FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]} */}
    </div>
  );
};
export default Add;
