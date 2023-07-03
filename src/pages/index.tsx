import React, { useEffect, useState } from "react";
import AuthModal from "@/Modal/Auth/AuthModal";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import { signOut } from "firebase/auth";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { userGroupState } from "@/atoms/checkUserGroupAtom";
import { deleteCookie, setCookie } from "cookies-next";

const Home: React.FC = () => {
  const [user] = useAuthState(auth);
  const [signOut, loading, error] = useSignOut(auth);
  const [isLogin, setIsLogin] = useState(false);
  const logout = async () => {
    deleteCookie("isAdmin");
    await signOut();
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
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Sign out"
              )}
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
