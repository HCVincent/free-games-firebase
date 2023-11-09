import React, { useState, useEffect } from "react";
import default_cover from "../../../../public/default_cover.png";
import { AiOutlineDown } from "react-icons/ai";
import SignOut from "@/components/SignOut/SignOut";
import { User } from "firebase/auth";
import UpdatePhoto from "./profileList/UpdatePhoto";
import { useRouter } from "next/router";
import Image from "next/image";
import AvatarModal from "@/Modal/Admin/AvatarModal";
import { auth } from "@/firebase/clientApp";

type AvatarProps = {
  user: User;
};

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  auth.currentUser?.getIdTokenResult().then((idTokenResult) => {
    // Confirm the user is an Admin.
    if (!!idTokenResult.claims.admin) {
      setIsAdmin(true);
    }
  });
  const router = useRouter();
  const [userPhoto, setUserPhoto] = useState("");
  useEffect(() => {
    if (user.photoURL) {
      setUserPhoto(user.photoURL);
    }
  }, [user]);
  return (
    <>
      {" "}
      {isAdmin && (
        <button
          className="btn btn-primary"
          onClick={() => router.push("/admin")}
        >
          Dashboard
        </button>
      )}
      <div className="dropdown dropdown-end ">
        <AvatarModal user={user} setUserPhoto={setUserPhoto} />
        <div className="flex items-center">
          <label tabIndex={0} className="btn m-1 h-full ml-4">
            <div className="avatar items-center cursor-pointer ">
              <div className="flex w-14 h-14 rounded-full">
                <Image
                  src={userPhoto ? userPhoto : default_cover.src}
                  alt="avatar"
                  width={50}
                  height={50}
                />
              </div>
              <AiOutlineDown className="ml-2" />
            </div>
          </label>
        </div>

        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 items-center"
        >
          <li className="w-full">
            <UpdatePhoto user={user} setUserPhoto={setUserPhoto} />
          </li>
          <li
            className="w-full flex"
            onClick={() => {
              router.push(`/collections/${user.uid}`);
            }}
          >
            <div className="w-full flex justify-center">Collections</div>
          </li>
          <li className="w-full">
            <SignOut />
          </li>
        </ul>
      </div>
    </>
  );
};
export default Avatar;
