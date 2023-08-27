import { User } from "firebase/auth";
import dynamic from "next/dynamic";
import React from "react";

// solving for
// Error: There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering.
const ThemeButton = dynamic(import("../ThemeButton/ThemeButton"), {
  ssr: false,
});
const Avatar = dynamic(import("./Avatar"), {
  ssr: false,
});
const AuthModal = dynamic(import("@/Modal/Auth/AuthModal"), {
  ssr: false,
});

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
