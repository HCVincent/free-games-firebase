// ThemeToggle.js
import React from "react";
import { useRecoilState } from "recoil";
import { themeState } from "./themeAtom";

const ThemeToggle = () => {
  const [theme, setTheme] = useRecoilState(themeState);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <label>
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      Toggle Theme
    </label>
  );
};

export default ThemeToggle;
