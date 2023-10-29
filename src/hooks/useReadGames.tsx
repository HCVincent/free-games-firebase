import { Game, gameState } from "@/atoms/gamesAtom";
import { firestore } from "@/firebase/clientApp";
import {
  query,
  collection,
  orderBy,
  where,
  limit,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

const useReadGames = () => {
  const numOfGamesPerPage = 9;
  const setGameStateValue = useSetRecoilState(gameState);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData>>();
  const readGames = async (
    firebaseCollection: string,
    searchWord?: string,
    limitedNum?: number,
    notToSetGameState?: boolean
  ) => {
    try {
      // const gameQuery = query(
      //   collection(firestore, "games"),
      //   orderBy("createdAt", "desc")
      // );

      const gameQuery = searchWord
        ? query(
            collection(firestore, firebaseCollection),
            orderBy("title", "asc"),
            where(
              "titleArray",
              "array-contains-any",
              searchWord.toLowerCase().split(" ")
            ),
            // where("title", ">=", searchWord.toLowerCase()),
            // where("title", "<=", searchWord.toLowerCase() + "\uf8ff")
            limit(limitedNum ? limitedNum : numOfGamesPerPage)
          )
        : query(
            collection(firestore, firebaseCollection),
            orderBy("updatedAt", "desc"),
            limit(limitedNum ? limitedNum : numOfGamesPerPage)
          );
      const gameDocs = await getDocs(gameQuery);
      // Get the last visible document
      setLastVisible(gameDocs.docs[gameDocs.docs.length - 1]);

      const games = gameDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (!notToSetGameState) {
        if (firebaseCollection === "games") {
          setGameStateValue((prev) => ({
            ...prev,
            games: games as Game[],
          }));
        } else {
          setGameStateValue((prev) => ({
            ...prev,
            gameRecommendations: games as Game[],
          }));
        }
      }

      return games as Game[];
    } catch (error) {
      console.log("readGames error", error);
    }
  };
  return { setLastVisible, setGameStateValue };
};
export default useReadGames;
