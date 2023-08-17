import { User } from "firebase/auth";
import React, { useRef } from "react";
import { updateProfile } from "firebase/auth";
import useSelectFile from "@/hooks/useSelectFile";
import { firestore, storage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
type UpdatePhotoProps = {
  user: User;
  setUserPhoto: (photoUrl: string) => void;
};

const UpdatePhoto: React.FC<UpdatePhotoProps> = ({ user, setUserPhoto }) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const { onSelectImage, selectedImage } = useSelectFile();
  const handleUpdatePhoto = async () => {
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
            // An error occurred
            // ...
          });
      }
    } catch (error) {
      console.log("handleUpdatePhoto error", error);
    }
  };
  return (
    <div className="flex w-full">
      <div
        className="flex justify-center w-full"
        onClick={async (e) => {
          e.preventDefault();
          selectedFileRef.current?.click();
          await handleUpdatePhoto();
        }}
      >
        Update Photo
      </div>
      <input
        required
        type="file"
        ref={selectedFileRef}
        className="hidden"
        onChange={(e) => {
          onSelectImage(e);
        }}
      />
    </div>
  );
};
export default UpdatePhoto;
