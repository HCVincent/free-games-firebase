import { authModalState } from "@/atoms/authModalAtom";
import { Game, gameState } from "@/atoms/gamesAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import { ref } from "@firebase/storage";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const useGames = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [gameStateValue, setGameStateValue] = useRecoilState(gameState);
  const setAuthModalState = useSetRecoilState(authModalState);

  const onSelectGame = (game: Game) => {
    setGameStateValue((prev) => ({
      ...prev,
      selectedGame: game,
    }));
  };

  return { setGameStateValue, onSelectGame, gameStateValue };
};
export default useGames;
