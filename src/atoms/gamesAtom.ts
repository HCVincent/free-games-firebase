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
    numberOfComments?: number;
    tags?: string[];
    password?: string;
    titleArray?: string[]
}


export type GameVote = {
    id: string;
    gameId: string;
    voteValue: number;
}

export type GameCollection = {
    id: string;
    gameId: string;
    title: string;
}

export type GameTag = {
    id: string;
    gameId: string[];
    title: string;
}

interface GameState {
    selectedGame: Game | null;
    games: Game[];
    gameRecommendations: Game[];
    gameVotes: GameVote[];
    gameCollections: GameCollection[];
    gameGrid: Game[];
    gameTags: GameTag[];
    gamesInTag: Game[];
}

const defaultGameState: GameState = {
    selectedGame: null,
    games: [],
    gameVotes: [],
    gameCollections: [],
    gameGrid: [],
    gameRecommendations: [],
    gameTags: [],
    gamesInTag: [],
}

export const gameState = atom<GameState>({
    key: "gameState",
    default: defaultGameState
})

