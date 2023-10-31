import { Game } from "@/atoms/gamesAtom";
import { auth } from "@/firebase/clientApp";
import { deleteCookie, setCookie } from "cookies-next";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ThemeButton from "../ThemeButton/ThemeButton";
import Avatar from "./Avatar";
import SearchInput from "./SearchInput";
import SearchResultList from "./SearchResultList";

const AuthModal = dynamic(() => import("../../../Modal/Auth/AuthModal"), {
  ssr: false,
});

type RightContentProps = {
  toggleTheme: () => void;
  theme: string;
};

const RightContent: React.FC<RightContentProps> = ({ toggleTheme, theme }) => {
  const [user] = useAuthState(auth);
  const [results, setResults] = useState<Game[]>([]);
  const [isMyInputFocused, setIsMyInputFocused] = useState(false);
  useEffect(() => {
    if (user) {
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
    }
  }, [user]);
  return (
    <div className="hidden lg:flex  items-center ">
      <div className="flex w-full h-full">
        <div className="flex flex-col w-full mr-2">
          <SearchInput
            customId="navbar"
            results={results}
            setResults={setResults}
            setIsMyInputFocused={setIsMyInputFocused}
          />
          {results && isMyInputFocused && (
            <SearchResultList results={results} />
          )}
        </div>
      </div>

      <div className="lg:flex lg:items-center">
        <ThemeButton
          toggleTheme={toggleTheme}
          theme={theme}
          buttonId="themeNavbar"
        />
      </div>
      <div className="lg:flex lg:items-center">
        {user ? <Avatar user={user} /> : <AuthModal />}
      </div>
    </div>
  );
};
export default RightContent;
