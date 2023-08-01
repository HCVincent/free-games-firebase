import { Game, gameState } from "@/atoms/gamesAtom";
import { firestore, storage } from "@/firebase/clientApp";
import arrayCompare from "@/utils/arrayCompare";
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  endAt,
  where,
  writeBatch,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadString,
} from "firebase/storage";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

const useGames = () => {
  const numOfGamesPerPage = 8;

  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData>>();
  const gameStateValue = useRecoilValue(gameState);
  const setGameStateValue = useSetRecoilState(gameState);
  const onSelectGame = (game: Game) => {
    setGameStateValue((prev) => ({
      ...prev,
      selectedGame: game,
    }));
  };

  const readGames = async (firebaseCollection: string, parameter?: string) => {
    try {
      // const gameQuery = query(
      //   collection(firestore, "games"),
      //   orderBy("createdAt", "desc")
      // );

      // Query the first page of docs
      const gameQuery = parameter
        ? query(
            collection(firestore, firebaseCollection),
            orderBy("title", "asc"),
            where("title", ">=", parameter),
            where("title", "<=", parameter + "\uf8ff"),
            limit(numOfGamesPerPage)
          )
        : query(
            collection(firestore, firebaseCollection),
            orderBy("updatedAt", "desc"),
            limit(numOfGamesPerPage)
          );
      const gameDocs = await getDocs(gameQuery);

      // Get the last visible document
      setLastVisible(gameDocs.docs[gameDocs.docs.length - 1]);

      const games = gameDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGameStateValue((prev) => ({
        ...prev,
        games: games as Game[],
      }));
    } catch (error) {
      console.log("readGames error", error);
    }
  };

  const onUpdateGameRec = async (
    firebaseCollection: string,
    gameId: string,
    recommend: boolean
  ): Promise<boolean> => {
    try {
      const docRef = doc(firestore, firebaseCollection, gameId);
      await updateDoc(docRef, {
        recommend: recommend,
      });

      return true;
    } catch (error: any) {
      console.log("onUpdateGameRec error", error.message);
      return false;
    }
  };

  const onUpdateGame = async (
    firebaseCollection: string,
    oldGame: Game,
    newGame: Game,
    uploadImages: boolean
  ): Promise<boolean> => {
    try {
      const gameDocRef = doc(firestore, firebaseCollection, oldGame?.id!);
      const batch = writeBatch(firestore);
      batch.update(gameDocRef, {
        title: newGame.title,
        body: newGame.body,
        updatedAt: newGame.updatedAt,
      });

      if (uploadImages) {
        const coverImageRef = ref(storage, `games/${oldGame.id}/coverImage`);
        if (oldGame.coverImage && oldGame.coverImage !== newGame.coverImage) {
          await listAll(coverImageRef)
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
        if (newGame.coverImage) {
          if (oldGame.coverImage !== newGame.coverImage) {
            await uploadString(
              coverImageRef,
              newGame.coverImage as string,
              "data_url"
            );
            const downloadURL = await getDownloadURL(coverImageRef);
            batch.update(gameDocRef, {
              coverImage: downloadURL,
            });
            newGame.coverImage = downloadURL;
          }
        } else {
          batch.update(gameDocRef, {
            coverImage: "",
          });
          newGame.coverImage = "";
        }

        const imageGroupRef = ref(storage, `games/${oldGame.id}/imagesGroup`);
        if (oldGame.imagesGroup && oldGame.imagesGroup.length > 0) {
          listAll(imageGroupRef)
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
        if (newGame.imagesGroup && newGame.imagesGroup.length > 0) {
          if (!arrayCompare(newGame.imagesGroup, oldGame.imagesGroup)) {
            const imagesUrlGroup = [];
            for (let index = 0; index < newGame.imagesGroup.length; index++) {
              const image = newGame.imagesGroup[index];
              const imagesGroupRef = ref(
                storage,
                `games/${newGame.id}/imagesGroup/${index}`
              );
              await uploadString(imagesGroupRef, image as string, "data_url");
              const downloadURL = await getDownloadURL(imagesGroupRef);
              imagesUrlGroup.unshift(downloadURL);
              batch.update(gameDocRef, {
                imagesGroup: imagesUrlGroup,
              });
            }
            newGame.imagesGroup = imagesUrlGroup;
          }
        } else {
          batch.update(gameDocRef, {
            imagesGroup: [],
          });
          newGame.imagesGroup = [];
        }
      }

      if (oldGame.video && oldGame.video !== newGame.video) {
        const videoRef = ref(storage, `games/${oldGame.id}/video`);
        listAll(videoRef)
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

      if (newGame.video) {
        if (newGame.video !== oldGame.video) {
          const videoRef = ref(storage, `games/${newGame.id}/video/video`);
          await uploadString(videoRef, newGame.video as string, "data_url");
          const downloadURL = await getDownloadURL(videoRef);
          batch.update(gameDocRef, {
            video: downloadURL,
          });
          newGame.video = downloadURL;
        } else {
          batch.update(gameDocRef, {
            video: "",
          });
          newGame.video = "";
        }
      }

      await batch.commit();
      setGameStateValue((prev) => ({
        ...prev,
        games: [
          newGame,
          ...prev.games.filter((item) => item.id !== newGame.id),
        ],
      }));
      return true;
    } catch (error: any) {
      console.log("handleUploadGame error", error.message);
      return false;
    }
  };

  const onDeleteGame = async (
    firebaseCollection: string,
    game: Game
  ): Promise<boolean> => {
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
        const imageGroupRef = ref(storage, `games/${game.id}/imagesGroup`);

        listAll(imageGroupRef)
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
        const videoRef = ref(storage, `games/${game.id}/video`);
        listAll(videoRef)
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
      const gameDocRef = doc(firestore, firebaseCollection, game.id!);
      await deleteDoc(gameDocRef);
      if (firebaseCollection === "games") {
        setGameStateValue((prev) => ({
          ...prev,
          games: prev.games.filter((item) => item.id !== game.id),
        }));
      }
      return true;
    } catch (error) {
      console.log("deleteGame error", error);
      return false;
    }
  };

  return {
    onUpdateGameRec,
    setGameStateValue,
    onSelectGame,
    gameStateValue,
    onDeleteGame,
    onUpdateGame,
    lastVisible,
    setLastVisible,
    readGames,
    numOfGamesPerPage,
  };
};
export default useGames;
