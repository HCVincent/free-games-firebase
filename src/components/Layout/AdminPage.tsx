import React from "react";

type AdminPageProps = {
  children: React.ReactNode;
};

const AdminPage: React.FC<AdminPageProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-1/5 ">
          {children && children[0 as keyof typeof children]}
        </div>

        <div className="flex flex-1 overflow-y-auto paragraph">
          {children && children[1 as keyof typeof children]}
        </div>
      </div>
    </div>
  );
};
export default AdminPage;
