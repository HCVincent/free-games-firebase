import { themeState } from "@/atoms/themeAtom";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import logo from "../../../public/logo_icon.png";
// import RightContent from "./RightContent/RightContent";

type NavbarProps = {};
const DrawerContent = dynamic(() => import("./DrawerContent"), {
  ssr: false,
});
const RightContent = dynamic(
  () => import("../Navbar/RightContent/RightContent"),
  {
    ssr: false,
  }
);
const Navbar: React.FC<NavbarProps> = () => {
  const router = useRouter();
  const [theme, setTheme] = useRecoilState(themeState);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "default" : "dark");
  };
  // When component mounts, read the theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    //@ts-ignore
    document.querySelector("html").setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="navbar max-h-16 bg-base-200 justify-center p-0 z-50">
      <div className="flex w-5/6 align-middle items-center  lg:justify-between">
        <div className="">
          <DrawerContent theme={theme} toggleTheme={toggleTheme} />
          <button
            className="hidden lg:flex lg:text-4xl  btn btn-ghost"
            onClick={() => router.push("/")}
          >
            <div className="flex w-auto h-10">
              <Image src={logo} alt="" className="lg:w-full h-full"></Image>
              <span className="normal-case">Home</span>
            </div>
          </button>
        </div>

        <div className="">
          <RightContent toggleTheme={toggleTheme} theme={theme} />
        </div>
      </div>
    </div>
  );
};
export default Navbar;
