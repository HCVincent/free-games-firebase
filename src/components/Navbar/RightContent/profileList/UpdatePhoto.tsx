import { avatarModalState } from "@/atoms/avatarModalAtom";
import { storage } from "@/firebase/clientApp";
import useSelectFile from "@/hooks/useSelectFile";
import { User, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useRef } from "react";
import { useRecoilState } from "recoil";
type UpdatePhotoProps = {
  user: User;
  setUserPhoto: (photoUrl: string) => void;
};

const UpdatePhoto: React.FC<UpdatePhotoProps> = ({ user, setUserPhoto }) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const { onSelectImage, selectedImage } = useSelectFile();
  const [modalState, setModalState] = useRecoilState(avatarModalState);
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
            console.log("updateProfile error", error);
          });
      }
    } catch (error) {
      console.log("handleUpdatePhoto error", error);
    }
  };
  return (
    <label
      htmlFor="my_modal_avatar"
      className="flex w-full"
      onClick={(e) => {
        setModalState((prev) => ({
          ...prev,
          view: "avatar",
        }));
      }}
    >
      <div className="flex justify-center w-full h-full">Update Photo</div>
    </label>
  );
};
export default UpdatePhoto;
