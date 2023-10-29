import TagsRead from "@/components/AdminPageContent/TagsCrud/TagsRead";
import useGames from "@/hooks/useGames";
import React from "react";

type indexProps = {};

const index: React.FC<indexProps> = () => {
  return (
    <div className="flex  w-5/6 h-[calc(100vh-14rem)]">
      <TagsRead />
    </div>
  );
};
export default index;
