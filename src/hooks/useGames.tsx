import { authModalState } from "@/atoms/authModalAtom";
import {
  Game,
  GameCollection,
  GameTag,
  GameVote,
  gameState,
} from "@/atoms/gamesAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import { allPlatformTypes } from "@/lib/constants";
import arrayCompare from "@/utils/arrayCompare";
import differenceSet from "@/utils/differenceSet";
import intersect from "@/utils/intersect";
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
  or,
  arrayUnion,
  arrayRemove,
  startAfter,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadString,
} from "firebase/storage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue, useSetRecoilState } from "recoil";

const useGames = () => {
  const router = useRouter();
  const numOfGamesPerPage = 9;
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData>>();
  const gameStateValue = useRecoilValue(gameState);
  const setGameStateValue = useSetRecoilState(gameState);
  const onSelectGame = (game: Game, parameter?: string) => {
    setGameStateValue((prev) => ({
      ...prev,
      selectedGame: game,
    }));
    if (parameter !== "admin") {
      router.push(`/games/${game.id}`);
      // window.open(`/games/${game.id}`, "_blank");
    }
  };
  const onSelectDownload = (game: Game) => {
    setGameStateValue((prev) => ({
      ...prev,
      selectedGame: game,
    }));
    // router.push(`/downloads/${game.id}`);
    window.open(`/downloads/${game.id}`, "_blank");
  };
  const readGamesByTag = async (
    tag: string,
    limitedNum?: number,
    gameId?: string
  ) => {
    try {
      const gameQuery = limitedNum
        ? query(
            collection(firestore, "games"),
            orderBy("updatedAt", "desc"),
            where("tags", "array-contains", tag),
            limit(limitedNum)
          )
        : query(
            collection(firestore, "games"),
            orderBy("updatedAt", "desc"),
            where("tags", "array-contains", tag)
          );
      const gameDocs = await getDocs(gameQuery);
      let games = gameDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (gameId) {
        games = games.filter((game) => {
          return game.id !== gameId; // Return true for the games you want to keep
        });
      }
      setGameStateValue((prev) => ({
        ...prev,
        gamesInTag: games as Game[],
      }));
    } catch (error) {
      console.log("gameQuery error", error);
    }
  };

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

  const readGamesBySiteMap = async () => {
    try {
      const gameQuery = query(
        collection(firestore, "games"),
        orderBy("title", "asc")
      );

      const gameDocs = await getDocs(gameQuery);
      const games = gameDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return games as Game[];
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
    uploadImages: boolean,
    uploadTypes?: boolean
  ): Promise<boolean> => {
    try {
      const gameDocRef = doc(firestore, firebaseCollection, oldGame?.id!);
      const batch = writeBatch(firestore);
      const newTitle = newGame.title.toLowerCase();
      batch.update(gameDocRef, {
        title: newTitle,
        body: newGame.body,
        address: newGame.address || "",
        updatedAt: newGame.updatedAt,
        titleArray: newTitle.split(" "),
        tags: newGame.tags || [],
        platformType: newGame.platformType || allPlatformTypes[0],
        password: newGame.password || "",
      });

      if (!oldGame.tags && newGame.tags && newGame.tags.length > 0) {
        for (let index = 0; index < newGame.tags.length; index++) {
          const tagDocRef = doc(firestore, "tags", newGame.tags[index]);
          batch.update(tagDocRef, {
            gameId: arrayUnion(newGame.id),
          });
        }
      } else if (oldGame.tags && oldGame.tags.length > 0) {
        const deletingArray = differenceSet(oldGame.tags, newGame.tags!);
        if (deletingArray && deletingArray.length > 0) {
          for (let index = 0; index < deletingArray.length; index++) {
            const tagDocRef = doc(firestore, "tags", deletingArray[index]);
            batch.update(tagDocRef, {
              gameId: arrayRemove(newGame.id),
            });
          }
        }
        if (newGame.tags && newGame.tags.length > 0) {
          for (let index = 0; index < newGame.tags.length; index++) {
            const tagDocRef = doc(firestore, "tags", newGame.tags[index]);
            batch.update(tagDocRef, {
              gameId: arrayUnion(newGame.id),
            });
          }
        }
      }
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
            const newCoverImageRef = ref(
              storage,
              `games/${newGame.id}/coverImage/coverImage`
            );
            await uploadString(
              newCoverImageRef,
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
        if (arrayCompare(oldGame.imagesGroup, newGame.imagesGroup)) {
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
      const batch = writeBatch(firestore);
      if (firebaseCollection === "games") {
        if (game.tags && game.tags.length > 0) {
          for (let index = 0; index < game.tags.length; index++) {
            const tagDocRef = doc(firestore, "tags", game.tags[index]);
            batch.update(tagDocRef, {
              gameId: arrayRemove(game.id),
            });
          }
        }
        if (game.coverImage) {
          const coverImageRef = ref(
            storage,
            `games/${game.id}/coverImage/coverImage`
          );

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
      }

      const gameDocRef = doc(firestore, firebaseCollection, game.id!);
      batch.delete(gameDocRef);
      await batch.commit();
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

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    game: Game,
    vote: number
  ): Promise<boolean> => {
    event.stopPropagation();
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return false;
    }
    // if(!user?.emailVerified) {

    // }
    try {
      let { voteStatus } = game;
      voteStatus = voteStatus ? voteStatus : 0;
      const existingVote = gameStateValue.gameVotes.find(
        (vote) => vote.gameId === game.id
      );
      const batch = writeBatch(firestore);
      const updatedGame = { ...game };
      const updatedGames = [...gameStateValue.games];
      let updatedGamesVotes = [...gameStateValue.gameVotes];
      let voteChange = vote;
      if (!existingVote) {
        const gameVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/gameVotes`)
        );
        const newVote: GameVote = {
          id: gameVoteRef.id,
          gameId: game.id!,
          voteValue: vote,
        };
        batch.set(gameVoteRef, newVote);
        updatedGame.voteStatus = voteStatus + vote;
        updatedGamesVotes = [...updatedGamesVotes, newVote];
      } else {
        const gameVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/gameVotes/${existingVote.id}`
        );
        if (existingVote.voteValue === vote) {
          updatedGame.voteStatus = voteStatus - vote;
          updatedGamesVotes = updatedGamesVotes.filter(
            (vote) => vote.id !== existingVote.id
          );

          batch.delete(gameVoteRef);
          voteChange *= -1;
        } else {
          updatedGame.voteStatus = voteStatus + 2 * vote;
          const voteIdx = gameStateValue.gameVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );
          updatedGamesVotes[voteIdx] = {
            ...existingVote,
            voteValue: vote,
          };

          batch.update(gameVoteRef, {
            voteValue: vote,
          });

          voteChange = 2 * vote;
        }
      }
      const gameIdx = gameStateValue.games.findIndex(
        (item) => item.id === game.id
      );
      updatedGames[gameIdx] = updatedGame;
      setGameStateValue((prev) => ({
        ...prev,
        games: updatedGames,
        gameVotes: updatedGamesVotes,
      }));
      if (gameStateValue.selectedGame) {
        setGameStateValue((prev) => ({
          ...prev,
          selectedGame: updatedGame,
        }));
      }
      const gameRef = doc(firestore, "games", game.id!);
      const recRef = doc(firestore, "recommendations", game.id!);
      batch.update(gameRef, {
        voteStatus: voteStatus + voteChange,
      });
      batch.update(recRef, {
        voteStatus: voteStatus + voteChange,
      });
      await batch.commit();
      return true;
    } catch (error) {
      console.log("onVote error", error);
      return false;
    }
  };

  const onCollect = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    game: Game
  ): Promise<boolean> => {
    event.stopPropagation();
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return false;
    }
    // if(!user?.emailVerified) {

    // }
    try {
      const existingCollect = gameStateValue.gameCollections.find(
        (collect) => collect.gameId === game.id
      );
      const batch = writeBatch(firestore);
      const updatedGames = [...gameStateValue.games];
      let updatedGamesCollections = [...gameStateValue.gameCollections];
      if (!existingCollect) {
        const gameCollectionRef = doc(
          collection(firestore, "users", `${user?.uid}/gameCollections`)
        );
        const newCollection: GameCollection = {
          id: gameCollectionRef.id,
          gameId: game.id!,
          title: game.title,
        };
        batch.set(gameCollectionRef, newCollection);
        updatedGamesCollections = [...updatedGamesCollections, newCollection];
      } else {
        const gameCollectionRef = doc(
          firestore,
          "users",
          `${user?.uid}/gameCollections/${existingCollect.id}`
        );
        updatedGamesCollections = updatedGamesCollections.filter(
          (collect) => collect.id !== existingCollect.id
        );
        batch.delete(gameCollectionRef);
      }
      const gameIdx = gameStateValue.games.findIndex(
        (item) => item.id === game.id
      );
      setGameStateValue((prev) => ({
        ...prev,
        games: updatedGames,
        gameCollections: updatedGamesCollections,
      }));

      await batch.commit();
      return true;
    } catch (error) {
      console.log("onVote error", error);
      return false;
    }
  };

  const getGameVotes = async () => {
    const gameVotesQuery = query(
      collection(firestore, "users", `${user?.uid}/gameVotes`)
    );

    const gameVoteDocs = await getDocs(gameVotesQuery);
    const gameVotes = gameVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setGameStateValue((prev) => ({
      ...prev,
      gameVotes: gameVotes as GameVote[],
    }));
  };

  const getGameCollections = async () => {
    const gameCollectionsQuery = query(
      collection(firestore, "users", `${user?.uid}/gameCollections`)
    );

    const gameCollectionDocs = await getDocs(gameCollectionsQuery);
    const gameCollections = gameCollectionDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setGameStateValue((prev) => ({
      ...prev,
      gameCollections: gameCollections as GameCollection[],
    }));
  };
  const getGameTags = async () => {
    const gameTagsQuery = query(collection(firestore, "tags"));

    const gameTagsDocs = await getDocs(gameTagsQuery);
    const gameTags = gameTagsDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setGameStateValue((prev) => ({
      ...prev,
      gameTags: gameTags as GameTag[],
    }));
  };

  useEffect(() => {
    getGameTags();
  }, []);

  useEffect(() => {
    if (!user) return;
    getGameVotes();
    getGameCollections();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setGameStateValue((prev) => ({
        ...prev,
        gameVotes: [],
        gameCollections: [],
      }));
    }
  }, [user]);

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
    readGamesByTag,
    numOfGamesPerPage,
    onVote,
    onCollect,
    onSelectDownload,
    readGamesBySiteMap,
  };
};
export default useGames;
