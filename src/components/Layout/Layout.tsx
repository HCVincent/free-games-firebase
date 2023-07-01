import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <p className="bg-slate-500">navbar </p>
      <main>{children}</main>
    </>
  );
};
export default Layout;
