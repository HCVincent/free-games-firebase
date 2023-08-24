import { User } from "firebase/auth";
import React, { useState } from "react";
import CommentInput from "./CommentInput";

type CommentsProps = { user: User; gameId: string };

const Comments: React.FC<CommentsProps> = ({ user, gameId }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState("");
  const onCreateComment = async () => {};
  return (
    <div className="flex flex-col">
      <CommentInput
        commentText={commentText}
        setCommentText={setCommentText}
        user={user}
        createLoading={createLoading}
        onCreateComment={onCreateComment}
      />
      {/* <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <>
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  borderTop="1px solid"
                  borderColor="gray.100"
                  p={20}
                >
                  <Text fontWeight={700} opacity={0.3}>
                    No Comments Yet
                  </Text>
                </Flex>
              </>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDeleteComment={onDeleteComment}
                    loadingDelete={loadingDeleteId === comment.id}
                    userId={user.uid}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack> */}
    </div>
  );
};
export default Comments;
