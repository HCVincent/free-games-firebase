import React from "react";

type AdminPageProps = {
  children: React.ReactNode;
};

const AdminPage: React.FC<AdminPageProps> = ({ children }) => {
  return (
    <div className="flex w-full h-screen">
      <div className="flex w-1/5 h-full">
        {children && children[0 as keyof typeof children]}
      </div>
      <div className="flex flex-1 h-full">
        {children && children[1 as keyof typeof children]}
      </div>
    </div>
  );
};
export default AdminPage;
