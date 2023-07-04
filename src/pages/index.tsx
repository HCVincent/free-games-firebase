import React, { useEffect, useState } from "react";
import AuthModal from "@/Modal/Auth/AuthModal";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import { signOut } from "firebase/auth";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { userGroupState } from "@/atoms/checkUserGroupAtom";
import { deleteCookie, setCookie } from "cookies-next";
import CrudButtons from "@/components/CrudButtons/CrudButtons";
import SignOut from "@/components/SignOut/SignOut";

const Home: React.FC = () => {
  const [user] = useAuthState(auth);
  const [isLogin, setIsLogin] = useState(false);

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
            <SignOut />
            <CrudButtons />
          </>
        ) : (
          <AuthModal />
        )}
      </div>
    </>
  );
};
export default Home;
