import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { fetcher } from "../../../graphql/fetcher";

// Define the types for the mutation
type LikeComment_LikeCommentMutation = {
  likeComment_likeComment: {
    status: string; // Adjust based on your GraphQL schema response
  };
};

type LikeCommentInput = {
  commentId: number; // Add other necessary fields as per your GraphQL schema
};

type LikeComment_LikeCommentMutationVariables = {
  input: LikeCommentInput; // This should match the structure of your input
};

// The GraphQL mutation document for liking a comment
const LikeComment_LikeCommentDocument = `
  mutation likeComment_likeComment($input: LikeCommentInput) {
    likeComment_likeComment(input: $input) {
      status
    }
  }
`;

// Custom hook for the like comment mutation
export const useLikeComment_LikeCommentMutation = <
  TError = unknown,
  TContext = unknown
>(
  options?: UseMutationOptions<
    LikeComment_LikeCommentMutation,
    TError,
    LikeComment_LikeCommentMutationVariables,
    TContext
  >
) =>
  useMutation<
    LikeComment_LikeCommentMutation,
    TError,
    LikeComment_LikeCommentMutationVariables,
    TContext
  >({
    mutationKey: ["likeComment_likeComment"],

    mutationFn: (variables?: LikeComment_LikeCommentMutationVariables) =>
      fetcher<
        LikeComment_LikeCommentMutation,
        LikeComment_LikeCommentMutationVariables
      >(LikeComment_LikeCommentDocument, variables)(),

    ...options,
  });
