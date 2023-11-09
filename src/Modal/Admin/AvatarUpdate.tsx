import Image from "next/image";
import React, { useRef, useState } from "react";
import default_cover from "../../../public/default_cover.png";
import useSelectFile from "@/hooks/useSelectFile";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "@/firebase/clientApp";
import { User } from "@firebase/auth";
import { updateProfile } from "firebase/auth";

type AvatarUpdateProps = {
  user: User;
  setUserPhoto: (photoUrl: string) => void;
};

const AvatarUpdate: React.FC<AvatarUpdateProps> = ({ user, setUserPhoto }) => {
  const { onSelectImage, selectedImage } = useSelectFile();
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const handleUpdatePhoto = async () => {
    setLoading(true);
    try {
      if (selectedImage) {
        const photoURLRef = ref(storage, `users/${user.uid}/photoURL`);
        await uploadString(photoURLRef, selectedImage as string, "data_url");
        const downloadURL = await getDownloadURL(photoURLRef);
        updateProfile(user, {
          photoURL: downloadURL,
        })
          .then(() => {
            setUserPhoto(downloadURL);
          })
          .catch((error) => {
            console.log("updateProfile error", error);
          });
      }
    } catch (error) {
      console.log("handleUpdatePhoto error", error);
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col justify-center w-full space-y-10">
      <Image
        src={selectedImage || user.photoURL || default_cover.src}
        alt="avatar"
        height={500}
        width={500}
        className="flex self-center rounded-full w-60 h-60"
      />
      <button
        className="btn btn-ghost capitalize"
        onClick={() => {
          selectedFileRef.current?.click();
        }}
      >
        Upload Image
      </button>
      <input
        type="file"
        ref={selectedFileRef}
        hidden
        onChange={onSelectImage}
      />
      <button
        className="btn btn-primary"
        onClick={async () => {
          await handleUpdatePhoto();
        }}
      >
        {loading ? (
          <div className="flex w-full h-full items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>Confirm</>
        )}
      </button>
    </div>
  );
};
export default AvatarUpdate;
