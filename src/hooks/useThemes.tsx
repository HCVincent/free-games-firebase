import { useState } from "react";

const useThemes = () => {
  const [theme, setTheme] = useState("dark");
  return {
    theme,
    setTheme,
  };
};
export default useThemes;
