import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Game = {
    id?: string;
    title: string;
    body: string;
    coverImage?: string;
    video?: string,
    imagesGroup?: string[];
    createdAt: Timestamp;
}

interface GameState {
    selectedGame: Game | null;
    games: Game[];
}

const defaultGameState: GameState = {
    selectedGame: null,
    games: [],
}

export const postState = atom<GameState>({
    key: "gameState",
    default: defaultGameState
})