import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { fetcher } from "../../../../graphql/fetcher";

// Define the types locally
type NotInterestedPost_AddNotInterestedPostMutation = {
  __typename?: "Mutation";
  notInterestedPost_addNotInterestedPost: {
    __typename?: "MutationResponse";
    status: any; // Replace 'any' with the specific type if known (e.g., string, boolean, etc.)
  };
};

type NotInterestedPostInput = {
  postId: number;
  reason?: string; // Adjust the fields as per the actual input requirements
};

type NotInterestedPost_AddNotInterestedPostMutationVariables = {
  input: NotInterestedPostInput;
};

// GraphQL mutation for adding a not-interested post
const NotInterestedPost_AddNotInterestedPostDocument = `
    mutation notInterestedPost_addNotInterestedPost($input: NotInterestedPostInput!) {
  notInterestedPost_addNotInterestedPost(input: $input) {
    status
  }
}
`;

export const useNotInterestedPost_AddNotInterestedPostMutation = <
  TError = unknown,
  TContext = unknown
>(
  options?: UseMutationOptions<
    NotInterestedPost_AddNotInterestedPostMutation,
    TError,
    NotInterestedPost_AddNotInterestedPostMutationVariables,
    TContext
  >
) =>
  useMutation<
    NotInterestedPost_AddNotInterestedPostMutation,
    TError,
    NotInterestedPost_AddNotInterestedPostMutationVariables,
    TContext
  >({
    mutationKey: ["notInterestedPost_addNotInterestedPost"],

    mutationFn: (
      variables: NotInterestedPost_AddNotInterestedPostMutationVariables
    ) =>
      fetcher<
        NotInterestedPost_AddNotInterestedPostMutation,
        NotInterestedPost_AddNotInterestedPostMutationVariables
      >(NotInterestedPost_AddNotInterestedPostDocument, variables)(),

    ...options,
  });
