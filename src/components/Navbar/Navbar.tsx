import { auth } from "@/firebase/clientApp";
import { setCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import SignOut from "../SignOut/SignOut";
import AuthModal from "@/Modal/Auth/AuthModal";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const [theme, setTheme] = React.useState("dark");
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const [user] = useAuthState(auth);
  const [isLogin, setIsLogin] = useState(false);
  const route = useRouter();
  useEffect(() => {
    //@ts-ignore
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);
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
    <div className="flex justify-end items-center">
      <input type="checkbox" className="toggle" onClick={toggleTheme} />
      {isLogin ? <SignOut /> : <AuthModal />}
    </div>
  );
};
export default Navbar;
