import { atom } from "recoil";

export interface UserGroup {
    isAdmin: boolean;
}

const defaultUserGroup: UserGroup = {
    isAdmin: false
}

export const userGroupState = atom<UserGroup>({
    key: "communitiesState",
    default: defaultUserGroup
})