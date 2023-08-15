import AuthModal from "@/Modal/Auth/AuthModal";
import SignOut from "@/components/SignOut/SignOut";
import React from "react";
import ThemeButton from "../ThemeButton/ThemeButton";
import Avatar from "./Avatar";
import { User } from "firebase/auth";

type RightContentProps = {
  isLogin: boolean;
  toggleTheme: () => void;
  theme: string;
  user: User | null | undefined;
};

const RightContent: React.FC<RightContentProps> = ({
  isLogin,
  toggleTheme,
  theme,
  user,
}) => {
  return (
    <div className="hidden lg:flex lg:items-center">
      <div className="lg:flex  ">
        <ThemeButton toggleTheme={toggleTheme} theme={theme} />
      </div>
      {user ? <Avatar user={user} /> : <AuthModal />}
    </div>
  );
};
export default RightContent;
