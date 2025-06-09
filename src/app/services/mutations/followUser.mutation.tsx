import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { fetcher } from "../../../graphql/fetcher";

// Define the types for the mutation
type Follow_FollowUserMutation = {
  follow_followUser: {
    status: string;
  };
};

type FollowerInput = {
  userId: number; // Adjust the fields as needed based on your GraphQL schema
  // Add other fields as necessary
};

type Follow_FollowUserMutationVariables = {
  followerInput: FollowerInput; // This should match the structure of your input
};

// The GraphQL mutation document for following a user
const Follow_FollowUserDocument = `
  mutation follow_followUser($followerInput: FollowerInput) {
    follow_followUser(followerInput: $followerInput) {
      status
    }
  }
`;

// Custom hook for the follow user mutation
export const useFollow_FollowUserMutation = <
  TError = unknown,
  TContext = unknown
>(
  options?: UseMutationOptions<
    Follow_FollowUserMutation,
    TError,
    Follow_FollowUserMutationVariables,
    TContext
  >
) =>
  useMutation<
    Follow_FollowUserMutation,
    TError,
    Follow_FollowUserMutationVariables,
    TContext
  >({
    mutationKey: ["follow_followUser"],

    mutationFn: (variables?: Follow_FollowUserMutationVariables) =>
      fetcher<Follow_FollowUserMutation, Follow_FollowUserMutationVariables>(
        Follow_FollowUserDocument,
        variables
      )(),

    ...options,
  });
