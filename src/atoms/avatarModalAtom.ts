import { atom } from "recoil";

export interface AvatarModalState {
    open: boolean;
    view: "avatar";
}

const defaultModalState: AvatarModalState = {
    open: false,
    view: "avatar"
}

export const avatarModalState = atom<AvatarModalState>({
    key: "authModalState",
    default: defaultModalState
})