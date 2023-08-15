import React, { useState } from "react";
import default_cover from "../../../../public/default_cover.png";
import { AiOutlineDown } from "react-icons/ai";
import SignOut from "@/components/SignOut/SignOut";
import { User } from "firebase/auth";
import UpdatePhoto from "./profileList/UpdatePhoto";

type AvatarProps = {
  user: User;
};

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const [userPhoto, setUserPhoto] = useState("");
  console.log("user", user);
  console.log("user.photoURL", user.photoURL);
  return (
    <div className="dropdown dropdown-end ">
      <label tabIndex={0} className="btn m-1 h-full">
        <div className="avatar items-center cursor-pointer ">
          <div className="flex w-14 h-14 rounded-full">
            <img src={user.photoURL ? user.photoURL : default_cover.src} />
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
        <li className="w-full">
          <SignOut />
        </li>
      </ul>
    </div>
  );
};
export default Avatar;
