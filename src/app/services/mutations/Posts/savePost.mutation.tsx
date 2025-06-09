import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { fetcher } from "../../../../graphql/fetcher";

// Define the types locally
type Post_SavePostMutation = {
  __typename?: "Mutation";
  post_savePost: {
    __typename?: "MutationResponse";
    status: any; // Replace 'any' with the specific type if known (e.g., string, boolean, etc.)
  };
};

type Post_SavePostMutationVariables = {
  postId: number;
  liked: boolean;
};

// GraphQL mutation for saving a post
const Post_SavePostDocument = `
    mutation post_savePost($postId: Int!, $liked: Boolean!) {
  post_savePost(postId: $postId, liked: $liked) {
    status
  }
}
`;

export const usePost_SavePostMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    Post_SavePostMutation,
    TError,
    Post_SavePostMutationVariables,
    TContext
  >
) =>
  useMutation<
    Post_SavePostMutation,
    TError,
    Post_SavePostMutationVariables,
    TContext
  >({
    mutationKey: ["post_savePost"],

    mutationFn: (variables?: Post_SavePostMutationVariables) =>
      fetcher<Post_SavePostMutation, Post_SavePostMutationVariables>(
        Post_SavePostDocument,
        variables
      )(),

    ...options,
  });
