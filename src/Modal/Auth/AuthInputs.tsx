import { authModalState } from "@/atoms/authModalAtom";
import React from "react";
import { useRecoilValue } from "recoil";
import Login from "./Login";
import SignUp from "./SignUp";

const AuthInputs: React.FC = () => {
  const modalState = useRecoilValue(authModalState);

  return (
    <div className="flex flex-col w-full">
      {modalState.view === "login" && <Login />}
      {modalState.view === "signup" && <SignUp />}
    </div>
  );
};
export default AuthInputs;
