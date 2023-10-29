import React from "react";

type PageContentProps = { children: React.ReactNode };
const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full lg:w-5/6 lg:flex-row justify-center lg:items-start ">
      <div className="flex w-full lg:w-2/3   ">
        {children && children[0 as keyof typeof children]}
      </div>
      <div className="flex w-full lg:w-1/3 ">
        {children && children[1 as keyof typeof children]}
      </div>
    </div>
  );
};
export default PageContent;
