import AuthModal from "@/Modal/Auth/AuthModal";
import Layout from "@/components/Layout/Layout";
import SignOut from "@/components/SignOut/SignOut";
import { auth } from "@/firebase/clientApp";
import { deleteCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

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
      <div className="flex w-full  items-center bg-base-100">
        {isLogin ? (
          <Layout>
            <SignOut />
          </Layout>
        ) : (
          <AuthModal />
        )}
      </div>
    </>
  );
};
export default Home;
