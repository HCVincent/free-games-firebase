import { adminModalState } from "@/atoms/adminModalAtom";
import React from "react";
import { useRecoilValue } from "recoil";
import Add from "./Add";

const AdminInputs: React.FC = () => {
  const modalState = useRecoilValue(adminModalState);

  return (
    <div className="flex flex-col w-full">
      {modalState.view === "add" && <Add />}
      {modalState.view === "update" && <>update</>}
    </div>
  );
};
export default AdminInputs;
