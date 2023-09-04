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

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  gameId: string;
  gameTitle: string;
  text: string;
  createdAt: Timestamp;
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
  const [reply, setReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  return (
    <div className="flex mt-4">
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
              {reply && (
                <textarea
                  value={replyText}
                  // onChange={(event) => setCommentText(event.target.value)}
                  // onChange={handleChange}
                  placeholder="What are your thoughts?"
                  className="textarea textarea-bordered textarea-lg w-full h-40 overflow:hidden"
                />
              )}
              <button
                className="text-base ml-5 btn btn-ghost"
                onClick={() => onDeleteComment(comment)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default CommentItem;
