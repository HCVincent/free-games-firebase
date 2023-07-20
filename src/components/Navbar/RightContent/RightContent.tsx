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
    <div className="lg:flex lg:items-center">
      <div className="hidden lg:flex  ">
        <ThemeButton toggleTheme={toggleTheme} theme={theme} />
      </div>
      {isLogin ? <SignOut /> : <AuthModal />}
    </div>
  );
};
export default RightContent;
