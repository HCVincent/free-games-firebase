import { adminModalState } from "@/atoms/adminModalAtom";
import React from "react";
import { useRecoilValue } from "recoil";
import Add from "./Add";
import Update from "./Update";

const AdminInputs: React.FC = () => {
  const modalState = useRecoilValue(adminModalState);

  return (
    <div className="flex flex-col w-full">
      {modalState.view === "add" && <Add />}
      {/* {modalState.view === "update" && <Update />} */}
    </div>
  );
};
export default AdminInputs;
