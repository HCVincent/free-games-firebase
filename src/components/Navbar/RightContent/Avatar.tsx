import React, { useState, useEffect } from "react";
import default_cover from "../../../../public/default_cover.png";
import { AiOutlineDown } from "react-icons/ai";
import SignOut from "@/components/SignOut/SignOut";
import { User } from "firebase/auth";
import UpdatePhoto from "./profileList/UpdatePhoto";
import Collections from "./profileList/Collections";
import { useRouter } from "next/router";

type AvatarProps = {
  user: User;
};

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const router = useRouter();
  const [userPhoto, setUserPhoto] = useState("");
  useEffect(() => {
    if (user.photoURL) {
      setUserPhoto(user.photoURL);
    }
  }, [user]);
  return (
    <div className="dropdown dropdown-end ">
      <label tabIndex={0} className="btn m-1 h-full">
        <div className="avatar items-center cursor-pointer ">
          <div className="flex w-14 h-14 rounded-full">
            <img src={userPhoto ? userPhoto : default_cover.src} />
          </div>
          <AiOutlineDown className="ml-2" />
        </div>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 items-center"
      >
        <li className="w-full">
          <UpdatePhoto user={user} setUserPhoto={setUserPhoto} />
        </li>
        <li
          onClick={() => {
            router.push(`collections/${user.uid}`);
          }}
        >
          Collections
        </li>
        <li className="w-full">
          <SignOut />
        </li>
      </ul>
    </div>
  );
};
export default Avatar;
