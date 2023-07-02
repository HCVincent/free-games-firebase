import { authModalState } from "@/atoms/authModalAtom";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import AuthInputs from "./AuthInputs";
import { auth } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";

const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [user] = useAuthState(auth);
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (user) setIsLogin(true);
  }, [user]);
  console.log("user", user);

  const handleLogin = () => {
    setModalState((prev) => ({
      ...prev,
      view: "login",
    }));
  };
  const handleSignUp = () => {
    setModalState((prev) => ({
      ...prev,
      view: "signup",
    }));
  };
  return (
    <>
      <label htmlFor="my_modal_7" className="btn" onClick={handleLogin}>
        Login
      </label>
      <label htmlFor="my_modal_7" className="btn" onClick={handleSignUp}>
        Sign up
      </label>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <div className="flex flex-col w-full justify-start items-start bg-base-100">
            <label className="label">
              {modalState.view === "login" && "Login"}
              {modalState.view === "signup" && "SignUp"}
            </label>

            <AuthInputs />
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
    </>
  );
};
export default AuthModal;
