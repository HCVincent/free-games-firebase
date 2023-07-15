import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full">
      <p className="bg-slate-500 w-full top-0">navbar </p>
      <main>{children}</main>
    </div>
  );
};
export default Layout;
