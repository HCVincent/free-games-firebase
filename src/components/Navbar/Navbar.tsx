import { auth } from "@/firebase/clientApp";
import { setCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import SignOut from "../SignOut/SignOut";
import AuthModal from "@/Modal/Auth/AuthModal";
import Link from "next/link";
import RightContent from "./RightContent/RightContent";
import ThemeButton from "./ThemeButton/ThemeButton";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const [user] = useAuthState(auth);
  const [isLogin, setIsLogin] = useState(false);
  const route = useRouter();
  const [theme, setTheme] = React.useState("dark");
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "default" : "dark");
  };
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
    <div className="navbar bg-base-200 justify-center p-0">
      <div className="flex w-full align-middle items-center lg:w-5/6 lg:justify-between  border-2 border-red-700">
        <div className="">
          <div className="drawer lg:hidden">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label htmlFor="my-drawer" className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </label>
            </div>
            <div className="drawer-side">
              <label htmlFor="my-drawer" className="drawer-overlay"></label>
              <div className="menu p-4 w-80 h-full bg-base-200 text-base-content justify-between">
                <ul>
                  {/* Sidebar content here */}
                  <li>
                    <a>Sidebar Item 1</a>
                  </li>
                  <li>
                    <a>Sidebar Item 2</a>
                  </li>
                </ul>
                <div className="">
                  <ThemeButton toggleTheme={toggleTheme} theme={theme} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <RightContent
            isLogin={isLogin}
            toggleTheme={toggleTheme}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
};
export default Navbar;
