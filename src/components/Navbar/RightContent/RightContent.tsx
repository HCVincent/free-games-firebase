import { User } from "firebase/auth";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import SearchInput from "./SearchInput";
import { Game } from "@/atoms/gamesAtom";
import SearchResultList from "./SearchResultList";

// solving for
// Error: There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering.
const ThemeButton = dynamic(import("../ThemeButton/ThemeButton"), {
  ssr: false,
});
const Avatar = dynamic(import("./Avatar"), {
  ssr: false,
});
const AuthModal = dynamic(import("@/Modal/Auth/AuthModal"), {
  ssr: false,
});

type RightContentProps = {
  isLogin: boolean;
  toggleTheme: () => void;
  theme: string;
  user: User | null | undefined;
};

const RightContent: React.FC<RightContentProps> = ({
  isLogin,
  toggleTheme,
  theme,
  user,
}) => {
  const [results, setResults] = useState<Game[]>([]);
  const [isMyInputFocused, setIsMyInputFocused] = useState(false);
  return (
    <div className="hidden lg:flex  items-center ">
      <div className="flex w-full h-full">
        <div className="flex flex-col w-full mr-2">
          <SearchInput
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
        <ThemeButton toggleTheme={toggleTheme} theme={theme} />
      </div>
      <div className="lg:flex lg:items-center">
        {user ? <Avatar user={user} /> : <AuthModal />}
      </div>
    </div>
  );
};
export default RightContent;
