import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { Exact, InputMaybe, Scalars } from "../../../types/general";
import { fetcher } from "../../../graphql/fetcher";
import { CommentType } from "../../../constants/storage/constant";

const Comment_CreateCommentDocument = `
  mutation comment_createComment($commentInput: CommentInput) {
    comment_createComment(commentInput: $commentInput) {
      status
    }
  }
`;

type CommentInput = {
  commentType: CommentType;
  contentAddress?: string;
  id?: InputMaybe<Scalars["Int"]>;
  mentionId?: number;
  parentId?: any;
  postId: any;
  text?: string;
};

type Comment_CreateCommentMutation = {
  __typename?: "Mutation";
  comment_createComment?: {
    __typename?: "ResponseBaseOfComment";
    status?: any | null;
  } | null;
};

type Comment_CreateCommentMutationVariables = Exact<{
  commentInput?: InputMaybe<CommentInput>;
}>;

export const useCreateComment = (
  options?: UseMutationOptions<
    Comment_CreateCommentMutation,
    Error,
    Comment_CreateCommentMutationVariables
  >
) => {
  return useMutation<
    Comment_CreateCommentMutation,
    Error,
    Comment_CreateCommentMutationVariables
  >({
    mutationFn: (variables) =>
      fetcher<
        Comment_CreateCommentMutation,
        Comment_CreateCommentMutationVariables
      >(Comment_CreateCommentDocument, variables)(),
    ...options,
  });
};
