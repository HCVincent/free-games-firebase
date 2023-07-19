import AuthModal from "@/Modal/Auth/AuthModal";
import SignOut from "@/components/SignOut/SignOut";
import React from "react";
import ThemeButton from "../ThemeButton/ThemeButton";

type RightContentProps = {
  isLogin: boolean;
  toggleTheme: () => void;
  theme: string;
};

const RightContent: React.FC<RightContentProps> = ({
  isLogin,
  toggleTheme,
  theme,
}) => {
  return (
    <div className="hidden lg:flex lg:items-center">
      <ThemeButton toggleTheme={toggleTheme} theme={theme} />
      {isLogin ? <SignOut /> : <AuthModal />}
    </div>
  );
};
export default RightContent;
