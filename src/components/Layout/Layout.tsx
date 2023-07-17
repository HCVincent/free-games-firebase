import React from "react";
import Navbar from "../Navbar/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="bg-slate-500 w-full top-0">
        <Navbar />
      </div>
      <main>{children}</main>
    </div>
  );
};
export default Layout;
