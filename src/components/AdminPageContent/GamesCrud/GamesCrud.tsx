import AdminModal from "@/Modal/Admin/AdminModal";
import { adminModalState } from "@/atoms/adminModalAtom";
import React from "react";
import { useRecoilState } from "recoil";
type GamesCrudProps = {};

const GamesCrud: React.FC<GamesCrudProps> = () => {
  return (
    <>
      <AdminModal />
    </>
  );
};
export default GamesCrud;
