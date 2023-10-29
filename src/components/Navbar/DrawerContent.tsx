import AuthInputs from "@/Modal/Auth/AuthInputs";
import OAuthButtons from "@/Modal/Auth/OAuthButtons";
import Link from "next/link";
import React, { useState } from "react";
import SignOut from "../SignOut/SignOut";
import SearchInput from "./RightContent/SearchInput";
import SearchResultList from "./RightContent/SearchResultList";
import ThemeButton from "./ThemeButton/ThemeButton";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { Game } from "@/atoms/gamesAtom";
import logo from "../../../public/logo_icon.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
type DrawerContentProps = {
  theme: string;
  toggleTheme: () => void;
};

const DrawerContent: React.FC<DrawerContentProps> = ({
  theme,
  toggleTheme,
}) => {
  const [user] = useAuthState(auth);
  const [isMyInputFocused, setIsMyInputFocused] = useState(false);
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [results, setResults] = useState<Game[]>([]);
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
  return (
    <div className="drawer lg:hidden">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        aria-label="Toggle Drawer"
      />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor="my-drawer" className="cursor-pointer flex">
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
          <span className="flex h-full text-2xl">Menu</span>
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
              <Link
                href={"/"}
                className="flex lg:text-4xl  btn btn-ghost justify-start"
              >
                <div className="flex w-auto h-10">
                  <Image src={logo} alt="" className="w-full h-full"></Image>
                  <span className="flex normal-case items-center justify-center ml-4 text-4xl">
                    Home
                  </span>
                </div>
              </Link>
            </li>
            <li>
              <SearchInput
                customId="drawer"
                results={results}
                setResults={setResults}
                setIsMyInputFocused={setIsMyInputFocused}
              />{" "}
              {results && isMyInputFocused && (
                <SearchResultList results={results} />
              )}
            </li>
          </ul>
          <div className="flex flex-col mb-10 text-4xl">
            <ThemeButton
              toggleTheme={toggleTheme}
              theme={theme}
              buttonId="themeSidebar"
            />
            {user ? (
              <SignOut />
            ) : (
              <>
                <label
                  htmlFor="my_modal_auth_mobile"
                  className="btn justify-start items-center"
                  onClick={handleLogin}
                >
                  Login
                </label>
                <label
                  htmlFor="my_modal_auth_mobile"
                  className="btn justify-start items-center"
                  onClick={handleSignUp}
                >
                  Sign up
                </label>
                {/* Put this part before </body> tag */}
                <input
                  type="checkbox"
                  id="my_modal_auth_mobile"
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
                    htmlFor="my_modal_auth_mobile"
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
  );
};
export default DrawerContent;
