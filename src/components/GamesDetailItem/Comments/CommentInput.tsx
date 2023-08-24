import { authModalState } from "@/atoms/authModalAtom";
import { User } from "firebase/auth";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

type CommentInputProps = {
  commentText: string;
  setCommentText: (value: string) => void;
  user: User;
  createLoading: boolean;
  onCreateComment: (commentText: string) => void;
};

const CommentInput: React.FC<CommentInputProps> = ({
  commentText,
  setCommentText,
  user,
  createLoading,
  onCreateComment,
}) => {
  const [charsRemaining, setCharsRemaining] = useState(1000);
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
  return (
    <div className="w-full mt-4">
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
              className={`mr-4 ${charsRemaining === 0 ? "text-red-600" : ""}`}
            >
              {charsRemaining} Characters remaining
            </span>
            <button
              className="btn btn-primary h-full"
              disabled={!commentText.length || commentText.length > 1000}
              onClick={() => onCreateComment(commentText)}
            >
              Comment
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <span className="text-2xl">Log in or sign up to leave a comment</span>
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
  );
};
export default CommentInput;
