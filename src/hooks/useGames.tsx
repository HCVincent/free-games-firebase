import { Game, gameState } from "@/atoms/gamesAtom";
import { firestore, storage, app } from "@/firebase/clientApp";
import { error } from "console";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, listAll, ref } from "firebase/storage";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Storage } from "firebase-admin/lib/storage/storage";

const useGames = () => {
  const gameStateValue = useRecoilValue(gameState);
  const setGameStateValue = useSetRecoilState(gameState);
  const onSelectGame = (game: Game) => {
    setGameStateValue((prev) => ({
      ...prev,
      selectedGame: game,
    }));
  };

  const onDeleteGame = async (game: Game): Promise<boolean> => {
    try {
      if (game.coverImage) {
        const coverImageRef = ref(storage, `games/${game.id}/coverImage`);

        listAll(coverImageRef)
          .then(async (listResults) => {
            const promises = listResults.items.map((item) => {
              return deleteObject(item);
            });
            await Promise.all(promises);
          })
          .catch((error) => {
            console.log("deleteStorageError", error);
          });
      }
      if (game.imagesGroup && game.imagesGroup.length > 0) {
        const coverImageRef = ref(storage, `games/${game.id}/imagesGroup`);

        listAll(coverImageRef)
          .then(async (listResults) => {
            const promises = listResults.items.map((item) => {
              return deleteObject(item);
            });
            await Promise.all(promises);
          })
          .catch((error) => {
            console.log("deleteStorageError", error);
          });
      }
      if (game.video) {
        const coverImageRef = ref(storage, `games/${game.id}/video`);

        listAll(coverImageRef)
          .then(async (listResults) => {
            const promises = listResults.items.map((item) => {
              return deleteObject(item);
            });
            await Promise.all(promises);
          })
          .catch((error) => {
            console.log("deleteStorageError", error);
          });
      }
      console.log("delete db start");
      const gameDocRef = doc(firestore, "games", game.id!);
      await deleteDoc(gameDocRef);
      console.log("delete db finish");
      setGameStateValue((prev) => ({
        ...prev,
        games: prev.games.filter((item) => item.id !== game.id),
      }));
      return true;
    } catch (error) {
      console.log("deleteGame error", error);
      return false;
    }
  };

  return { setGameStateValue, onSelectGame, gameStateValue, onDeleteGame };
};
export default useGames;
