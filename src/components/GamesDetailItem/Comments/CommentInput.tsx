import { authModalState } from "@/atoms/authModalAtom";
import { User } from "firebase/auth";
import React from "react";
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
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="What are your thoughts?"
            className="textarea textarea-bordered textarea-lg w-full h-40"
          />
          <div className="absolute end-2 bottom-6 justify-end rounded-sm h-10 ">
            <button
              className="btn btn-primary"
              disabled={!commentText.length}
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
