import { Icon, Stack, Text } from "@chakra-ui/react";
import { User } from "@firebase/auth";
import { Timestamp } from "firebase-admin/firestore";
import moment from "moment";
import Image from "next/image";
import React, { useState } from "react";
import {
  IoArrowDownCircleOutline,
  IoArrowUpCircleOutline,
} from "react-icons/io5";
import defaultcover from "../../../../public/default_cover.png";
import { useRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { writeBatch } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  gameId: string;
  gameTitle: string;
  text: string;
  createdAt: Timestamp;
  subComments?: Comment[];
  isRoot?: boolean;
};
type CommentItemProps = {
  comment: Comment;
  onDeleteComment: (comment: Comment) => void;
  loadingDelete: boolean;
  user: User;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDeleteComment,
  loadingDelete,
  user,
}) => {
  const [subComments, setSubComments] = useState<Comment[]>([]);
  const [charsRemaining, setCharsRemaining] = useState(1000);
  const [reply, setReply] = useState(false);
  const [replyText, setReplyText] = useState("");
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
  // const onCreateComment = async (commentText: string) => {
  //   try {
  //     const batch = writeBatch(firestore);
  //     const commentDocRef = doc(collection(firestore, "comments"));
  //     const newComment: Comment = {
  //       id: commentDocRef.id,
  //       creatorId: user.uid,
  //       creatorDisplayText: user.email!.split("@")[0],
  //       gameId: game.id!,
  //       gameTitle: game.title!,
  //       text: commentText,
  //       createdAt: serverTimestamp() as Timestamp,
  //       isRoot: false,
  //     };
  //     batch.set(commentDocRef, newComment);
  //     newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;
  //     const gameDocRef = doc(firestore, "games", game.id!);
  //     batch.update(gameDocRef, {
  //       numberOfComments: increment(1),
  //     });
  //     await batch.commit();
  //     setCommentText("");
  //     setComments((prev) => [newComment, ...prev]);
  //     setGameState((prev) => ({
  //       ...prev,
  //       selectedGame: {
  //         ...prev.selectedGame,
  //         numberOfComments: prev.selectedGame?.numberOfComments! + 1,
  //       } as Game,
  //     }));
  //   } catch (error) {
  //     console.log("onCreateComment error", error);
  //   }
  // };
  return (
    <div className="flex mt-4 w-full">
      <div className="flex h-20 w-20 justify-center">
        <Image
          src={user.photoURL ? user.photoURL : defaultcover}
          color="gray.300"
          alt="avatar"
          width={50}
          height={50}
          className="h-full w-full rounded-md object-cover"
        />
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
        <div className="flex align-middle cursor-pointer">
          {/* <Icon as={IoArrowUpCircleOutline} />
          <Icon as={IoArrowDownCircleOutline} /> */}
          <button
            className="text-base btn btn-ghost"
            onClick={() => setReply(!reply)}
          >
            Reply
          </button>{" "}
          {user.uid === comment.creatorId && (
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
                    // onClick={() => onCreateComment(commentText)}
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
        {subComments && subComments.length > 0 && <></>}
      </div>
    </div>
  );
};
export default CommentItem;
