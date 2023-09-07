import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full min-h-screen justify-between">
      <div className="w-full top-0 sticky z-50 ">
        <Navbar />
      </div>
      <main className="flex justify-center w-full">{children}</main>
      <Footer />
    </div>
  );
};
export default Layout;
