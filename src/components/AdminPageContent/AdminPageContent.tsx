import React from "react";
import GamesCrud from "./GamesCrud/GamesCrud";

type AdminPageContentProps = {
  selectedTab: string;
};

const AdminPageContent: React.FC<AdminPageContentProps> = ({ selectedTab }) => {
  return (
    <div>
      {selectedTab === "games" && <GamesCrud />}
      {selectedTab === "users" && <>users</>}
    </div>
  );
};
export default AdminPageContent;
