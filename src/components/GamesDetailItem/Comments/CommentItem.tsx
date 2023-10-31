import { authModalState } from "@/atoms/authModalAtom";
import { Game, gameState } from "@/atoms/gamesAtom";
import { firestore } from "@/firebase/clientApp";
import { User } from "@firebase/auth";
import { Timestamp } from "firebase-admin/firestore";
import {
  arrayUnion,
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
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import defaultcover from "../../../../public/default_cover.png";

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  creatorImageURL?: string;
  gameId: string;
  gameTitle: string;
  text: string;
  createdAt: Timestamp;
  subCommentsId?: string[];
  isRoot?: boolean;
  fatherCommentId?: string;
};
type CommentItemProps = {
  comment: Comment;
  onDeleteComment: (comment: Comment) => void;
  loadingDelete: boolean;
  user: User;
  gameId: string;
  gameTitle: string;
  loadingDeleteId: string;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDeleteComment,
  loadingDelete,
  user,
  gameId,
  gameTitle,
  loadingDeleteId,
}) => {
  const setGameState = useSetRecoilState(gameState);
  const [subComments, setSubComments] = useState<Comment[]>([]);
  const [charsRemaining, setCharsRemaining] = useState(1000);
  const [reply, setReply] = useState(false);
  const [commentText, setCommentText] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length > 1000) return;
    setCommentText(event.target.value);
    setCharsRemaining(1000 - event.target.value.length);
  };
  const [modalState, setModalState] = useRecoilState(authModalState);
  const handleLogin = () => {
    setModalState((prev) => ({
      ...prev,
      open: true,
      view: "login",
    }));
  };
  const onCreateComment = async (commentText: string) => {
    try {
      const batch = writeBatch(firestore);
      const commentDocRef = doc(collection(firestore, "comments"));
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        creatorImageURL: user.photoURL || "",
        gameId: gameId,
        gameTitle: gameTitle,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
        isRoot: false,
        fatherCommentId: comment.id,
      };
      const subCommentDocRef = doc(firestore, "comments", comment.id);
      batch.update(subCommentDocRef, {
        subCommentsId: arrayUnion(commentDocRef.id),
      });
      batch.set(commentDocRef, newComment);
      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;
      const gameDocRef = doc(firestore, "games", gameId);
      batch.update(gameDocRef, {
        numberOfComments: increment(1),
      });
      await batch.commit();
      setCommentText("");
      setSubComments((prev) => [...prev, newComment]);
      setReply(false);
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
  };
  const getGameComments = async () => {
    try {
      if (comment.subCommentsId && comment.subCommentsId.length > 0) {
        const subCommentsQuery = query(
          collection(firestore, "comments"),
          where("id", "in", comment.subCommentsId),
          orderBy("createdAt", "desc")
        );
        const commentDocs = await getDocs(subCommentsQuery);
        const comments = commentDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubComments(comments as Comment[]);
      }
    } catch (error) {
      console.log("getGameComments error", error);
    }
  };

  useEffect(() => {
    if (!gameId) return;
    getGameComments();
  }, [gameId]);
  return (
    <div className="flex mt-4 w-full">
      <div className="flex  justify-center">
        <div className="flex flex-col ">
          {" "}
          <Image
            src={
              comment.creatorImageURL ? comment.creatorImageURL : defaultcover
            }
            color="gray.300"
            alt="avatar"
            width={50}
            height={50}
            className=" rounded-md object-cover h-20 w-20"
          />
          {subComments.length > 0 && (
            <div className="flex flex-1 justify-center">
              <div className=" border-l-4 h-1/2 border-gray-500"></div>
            </div>
          )}
        </div>
      </div>
      <div className="ml-4 flex flex-col flex-1">
        <div className="flex items-end">
          <span className="font-bold text-2xl">
            {comment.creatorDisplayText}
          </span>
          <span className="text-gray-500 ml-4">
            {moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}
          </span>
          {loadingDelete && (
            <span className="loading loading-spinner loading-md ml-4"></span>
          )}
        </div>
        <span className="text-lg">{comment.text}</span>
        <div className="flex align-middle ">
          {/* <Icon as={IoArrowUpCircleOutline} />
          <Icon as={IoArrowDownCircleOutline} /> */}
          <button
            className="text-base btn btn-ghost"
            onClick={() => setReply(!reply)}
          >
            Reply
          </button>{" "}
          {user?.uid === comment.creatorId && (
            <>
              <button
                className="text-base ml-5 btn btn-ghost"
                onClick={() => onDeleteComment(comment)}
              >
                Delete
              </button>
            </>
          )}
        </div>
        {reply && (
          <div className="w-full">
            {user ? (
              <div className="w-full relative">
                <div className="relative mb-1 w-full">
                  Comment as{" "}
                  <span style={{ color: "#3182CE" }}>
                    {user?.email?.split("@")[0]}
                  </span>
                </div>
                <textarea
                  value={commentText}
                  // onChange={(event) => setCommentText(event.target.value)}
                  onChange={handleChange}
                  placeholder="What are your thoughts?"
                  className="textarea textarea-bordered textarea-lg w-full h-40 overflow:hidden"
                />
                <div className="absolute end-6 bottom-6 justify-end rounded-sm h-10">
                  <span
                    className={`mr-4 ${
                      charsRemaining === 0 ? "text-red-600" : ""
                    }`}
                  >
                    {charsRemaining} Characters remaining
                  </span>
                  <button
                    className="btn btn-ghost h-full mr-2"
                    onClick={() => setReply(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary h-full"
                    disabled={!commentText.length || commentText.length > 1000}
                    onClick={() => onCreateComment(commentText)}
                  >
                    Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-2xl">
                  Log in or sign up to leave a comment
                </span>
                <div>
                  <label
                    htmlFor="my_modal_auth"
                    className="btn justify-start items-center"
                    onClick={handleLogin}
                  >
                    Login
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
        {subComments &&
          subComments.length > 0 &&
          subComments.map((comment) => (
            <div className="flex" key={comment.id}>
              <CommentItem
                key={comment.id}
                comment={comment}
                onDeleteComment={onDeleteComment}
                loadingDelete={loadingDeleteId === comment.id}
                user={user}
                gameId={gameId}
                gameTitle={gameTitle}
                loadingDeleteId={loadingDeleteId}
              ></CommentItem>
            </div>
          ))}
      </div>
    </div>
  );
};
export default CommentItem;
