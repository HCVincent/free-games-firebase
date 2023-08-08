import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Game = {
    id?: string;
    recommend: boolean;
    voteStatus: number;
    gameDocRefId?: string;
    title: string;
    chineseTitle?: string;
    body: string;
    chineseBody?: string;
    address?: string;
    coverImage?: string;
    video?: string,
    imagesGroup?: string[];
    createdAt?: Timestamp;
    updatedAt: Timestamp;
}


export type GameVote = {
    id: string;
    gameId: string;
    voteValue: number;
}

interface GameState {
    selectedGame: Game | null;
    games: Game[];
    gameVotes: GameVote[];
}

const defaultGameState: GameState = {
    selectedGame: null,
    games: [],
    gameVotes: [],
}

export const gameState = atom<GameState>({
    key: "gameState",
    default: defaultGameState
})