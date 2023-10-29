import { auth } from "@/firebase/clientApp";
import { deleteCookie, setCookie } from "cookies-next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
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
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "default" : "dark");
  };

  useEffect(() => {
    //@ts-ignore
    document.querySelector("html").setAttribute("data-theme", theme);
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
