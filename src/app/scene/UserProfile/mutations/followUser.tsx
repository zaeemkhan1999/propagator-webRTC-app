import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { fetcher } from "../../../../graphql/fetcher";


type FollowUserMutationVariables = {
  followerInput?: {
    followerId: number | undefined;
    followedId: number;
  };
};

type FollowUserMutationResponse = {
  follow_followUser?: {
    status?: {
      code: number;
      value: string;
    };
  } | null;
};
const FollowUserMutationDocument = `
  mutation FollowUser($followerInput: FollowerInput) {
    follow_followUser(followerInput: $followerInput) {
      status
    }
  }
`;

export const useFollowUserMutation = (
  options?: UseMutationOptions<
    FollowUserMutationResponse,
    Error,
    FollowUserMutationVariables
  >
) => {
  return useMutation<FollowUserMutationResponse, Error, FollowUserMutationVariables>({
    mutationFn: (variables: FollowUserMutationVariables) =>
      fetcher<FollowUserMutationResponse, FollowUserMutationVariables>(
        FollowUserMutationDocument,
        variables
      )(),
    ...options,
  });
};
