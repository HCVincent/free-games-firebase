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
import { useRouter } from "next/router";

const Home: React.FC = () => {
  const [user] = useAuthState(auth);
  const [isLogin, setIsLogin] = useState(false);
  const route = useRouter();
  useEffect(() => {
    if (user) {
      setIsLogin(true);
      const setDefaultLoginCookie = async () => {
        await auth.currentUser
          ?.getIdTokenResult()
          .then((idTokenResult) => {
            // Confirm the user is an Admin.
            if (!!idTokenResult.claims.admin) {
              // Show admin UI.
              setCookie("isAdmin", "true");
              route.push("/admin");
            } else {
              deleteCookie("isAdmin");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      };
      setDefaultLoginCookie();
    } else {
      setIsLogin(false);
    }
  }, [user]);
  return (
    <>
      <div className="flex w-full h-screen justify-center items-center bg-base-100">
        {isLogin ? (
          <>
            <SignOut />
          </>
        ) : (
          <AuthModal />
        )}
      </div>
    </>
  );
};
export default Home;
