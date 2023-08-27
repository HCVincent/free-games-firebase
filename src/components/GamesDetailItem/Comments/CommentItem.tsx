import { Icon, Stack, Text } from "@chakra-ui/react";
import { User } from "@firebase/auth";
import { Timestamp } from "firebase-admin/firestore";
import moment from "moment";
import Image from "next/image";
import React from "react";
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
        <Text fontSize="10pt">{comment.text}</Text>
        <Stack direction="row" align="center" cursor="pointer" color="gray.500">
          <Icon as={IoArrowUpCircleOutline} />
          <Icon as={IoArrowDownCircleOutline} />
          {user.uid === comment.creatorId && (
            <>
              <Text fontSize="9pt" _hover={{ color: "blue.500" }}>
                Edit
              </Text>
              <Text
                fontSize="9pt"
                _hover={{ color: "blue.500" }}
                onClick={() => onDeleteComment(comment)}
              >
                Delete
              </Text>
            </>
          )}
        </Stack>
      </div>
    </div>
  );
};
export default CommentItem;
