import React from "react";
import Navbar from "../Navbar/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full top-0 sticky">
        <Navbar />
      </div>
      <main className="flex justify-center">{children}</main>
    </div>
  );
};
export default Layout;
