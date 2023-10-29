import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import CommentItem, { Comment } from "./CommentItem";
import { firestore } from "@/firebase/clientApp";
import {
  Timestamp,
  arrayRemove,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { Game, gameState } from "@/atoms/gamesAtom";
import { useSetRecoilState } from "recoil";

type CommentsProps = { user: User; game: Game };

const Comments: React.FC<CommentsProps> = ({ user, game }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState("");
  const setGameState = useSetRecoilState(gameState);
  const onCreateComment = async () => {
    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);
      const commentDocRef = doc(collection(firestore, "comments"));
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        creatorImageURL: user.photoURL || undefined,
        gameId: game.id!,
        gameTitle: game.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
        isRoot: true,
      };
      batch.set(commentDocRef, newComment);
      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      const gameDocRef = doc(firestore, "games", game.id!);
      batch.update(gameDocRef, {
        numberOfComments: increment(1),
      });
      await batch.commit();

      setCommentText("");
      setComments((prev) => [newComment, ...prev]);
      setGameState((prev) => ({
        ...prev,
        selectedGame: {
          ...prev.selectedGame,
          numberOfComments: prev.selectedGame?.numberOfComments! + 1,
        } as Game,
      }));
    } catch (error) {
      console.log("onCreateComment error", error);
    }
    setCreateLoading(false);
  };
  const onDeleteComment = async (comment: Comment) => {
    setLoadingDeleteId(comment.id);
    try {
      const batch = writeBatch(firestore);
      if (comment.subCommentsId && comment.subCommentsId.length > 0) {
        const commentsQuery = query(
          collection(firestore, "comments"),
          where("id", "in", comment.subCommentsId)
        );
        console.log("comment.subCommentsId", comment.subCommentsId);
        const commentDocs = await getDocs(commentsQuery);
        const comments = commentDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Comment[];
        if (comments && comments.length > 0) {
          comments.map((com) => {
            onDeleteComment(com);
          });
        }
        comment.subCommentsId.map((subCommentId) => {
          const subCommentDocRef = doc(firestore, "comments", subCommentId);
          batch.delete(subCommentDocRef);
        });
      }
      if (comment.fatherCommentId) {
        const fatherDocRef = doc(firestore, "comments", comment.id!);
        batch.update(fatherDocRef, {
          subCommentsId: arrayRemove(comment.id),
        });
      }
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);
      const gameDocRef = doc(firestore, "games", game.id!);
      batch.update(gameDocRef, {
        numberOfComments: increment(-1),
      });
      await batch.commit();

      setGameState((prev) => ({
        ...prev,
        selectedGame: {
          ...prev.selectedGame,
          numberOfComments: prev.selectedGame?.numberOfComments! - 1,
        } as Game,
      }));
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error) {
      console.log("onDeleteComment", error);
    }
    setLoadingDeleteId("");
  };
  const getGameComments = async () => {
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("gameId", "==", game.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      let rootComments = comments as Comment[];
      rootComments = rootComments.filter((rootComment) => {
        return rootComment.isRoot;
      });
      setComments(rootComments as Comment[]);
    } catch (error) {
      console.log("getGameComments error", error);
    }
  };
  useEffect(() => {
    if (!game) return;
    getGameComments();
  }, [game]);
  return (
    <div className="flex flex-col">
      <CommentInput
        commentText={commentText}
        setCommentText={setCommentText}
        user={user}
        createLoading={createLoading}
        onCreateComment={onCreateComment}
      />
      <div className="flex flex-col">
        {comments.length === 0 ? (
          <>NOT COMMENT YET</>
        ) : (
          <>
            {comments.map((comment) => (
              <div className="flex" key={comment.id}>
                <CommentItem
                  gameId={game.id!}
                  gameTitle={game.title!}
                  key={comment.id}
                  comment={comment}
                  onDeleteComment={onDeleteComment}
                  loadingDelete={loadingDeleteId === comment.id}
                  user={user}
                  loadingDeleteId={loadingDeleteId}
                ></CommentItem>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
export default Comments;
