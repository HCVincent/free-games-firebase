import AuthInputs from "@/Modal/Auth/AuthInputs";
import OAuthButtons from "@/Modal/Auth/OAuthButtons";
import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import { deleteCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import SignOut from "../SignOut/SignOut";
import RightContent from "./RightContent/RightContent";
import ThemeButton from "./ThemeButton/ThemeButton";
import Image from "next/image";
import logo from "../../../public/logo_icon.png";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [isLogin, setIsLogin] = useState(false);
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "default" : "dark");
  };
  const [modalState, setModalState] = useRecoilState(authModalState);

  const handleLogin = () => {
    setModalState((prev) => ({
      ...prev,
      open: true,
      view: "login",
    }));
  };
  const handleSignUp = () => {
    setModalState((prev) => ({
      ...prev,
      open: true,
      view: "signup",
    }));
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
              setCookie(process.env.NEXT_PUBLIC_AUTH_ADMIN!, "true");
            } else {
              deleteCookie(process.env.NEXT_PUBLIC_AUTH_ADMIN!);
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
    <div className="navbar max-h-16 bg-base-200 justify-center p-0 ">
      <div className="flex w-full align-middle items-center lg:w-5/6 lg:justify-between">
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
              <label htmlFor="my-drawer" className="drawer-overlay">
                {" "}
              </label>
              <div className="menu p-4  h-full bg-base-200 text-base-content justify-between w-5/6">
                <ul>
                  {/* Sidebar content here */}
                  <li>
                    <a>Sidebar Item 1</a>
                  </li>
                  <li>
                    <a>Sidebar Item 2</a>
                  </li>
                </ul>
                <div className="flex flex-col">
                  <ThemeButton toggleTheme={toggleTheme} theme={theme} />
                  {isLogin ? (
                    <SignOut />
                  ) : (
                    <>
                      <label
                        htmlFor="my_modal_auth"
                        className="btn justify-start items-center"
                        onClick={handleLogin}
                      >
                        Login
                      </label>
                      <label
                        htmlFor="my_modal_auth"
                        className="btn justify-start items-center"
                        onClick={handleSignUp}
                      >
                        Sign up
                      </label>
                      {/* Put this part before </body> tag */}
                      <input
                        type="checkbox"
                        id="my_modal_auth"
                        className="modal-toggle"
                        checked={modalState.open}
                        onChange={() => {}}
                      />
                      <div className="modal">
                        <div className="modal-box">
                          <div className="flex flex-col w-full justify-start items-start bg-base-100">
                            <label className="label">
                              {" "}
                              {modalState.view === "login" && "login"}
                              {modalState.view === "signup" && "signup"}
                            </label>

                            <AuthInputs />
                            <OAuthButtons />
                          </div>
                        </div>
                        <label
                          className="modal-backdrop"
                          htmlFor="my_modal_auth"
                          onClick={() =>
                            setModalState((prev) => ({
                              ...prev,
                              open: false,
                            }))
                          }
                        >
                          Close
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            className="hidden lg:flex lg:text-4xl  btn btn-ghost"
            onClick={() => router.push("/")}
          >
            <div className="flex w-auto h-10">
              <Image src={logo} alt="home" className="w-full h-full"></Image>
              <span className="normal-case">Home</span>
            </div>
          </button>
        </div>

        <div className="">
          <RightContent
            user={user}
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
