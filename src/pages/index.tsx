import React, { useEffect, useState } from "react";
import AuthModal from "@/Modal/Auth/AuthModal";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { userGroupState } from "@/atoms/checkUserGroupAtom";
import { deleteCookie, setCookie } from "cookies-next";

const Home: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [user] = useAuthState(auth);
  const [isLogin, setIsLogin] = useState(false);
  const logout = async () => {
    deleteCookie("isAdmin");
    await signOut(auth);
  };
  useEffect(() => {
    if (user) setIsLogin(true);
    else {
      setIsLogin(false);
    }
  }, [user]);
  return (
    <>
      <div className="flex w-full h-screen justify-center items-center bg-base-100">
        {isLogin ? (
          <>
            <button className="btn btn-primary" onClick={logout}>
              signout
            </button>
          </>
        ) : (
          <>
            <AuthModal />
          </>
        )}
      </div>
    </>
  );
};
export default Home;
