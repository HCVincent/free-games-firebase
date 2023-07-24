import { atom } from "recoil";

export interface AdminModalState {
    open: boolean;
    view: "add" | "update" | "recommendations";
}

const defaultModalState: AdminModalState = {
    open: false,
    view: "add"
}

export const adminModalState = atom<AdminModalState>({
    key: "authModalState",
    default: defaultModalState
})