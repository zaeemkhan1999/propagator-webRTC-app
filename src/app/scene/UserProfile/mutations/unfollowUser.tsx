import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { fetcher } from "../../../../graphql/fetcher";

type FollowUnFollowUserMutationVariables = {
  followerInput?: {
    followerId: number;
    followedId: number;
  };
};

type FollowUnFollowUserMutationResponse = {
  follow_unFollowUser?: {
    result?: {
      code: number;
      value: string;
    } | null;
    status?: {
      code: number;
      value: string;
    };
  } | null;
};

const FollowUnFollowUserMutationDocument = `
  mutation FollowUnFollowUser($followerInput: FollowerInput) {
    follow_unFollowUser(followerInput: $followerInput) {
      result {
        code
        value
      }
      status
    }
  }
`;

export const useFollowUnFollowUserMutation = (
  options?: UseMutationOptions<
    FollowUnFollowUserMutationResponse,
    Error,
    FollowUnFollowUserMutationVariables
  >
) => {
  return useMutation<
    FollowUnFollowUserMutationResponse,
    Error,
    FollowUnFollowUserMutationVariables
  >({
    mutationFn: (variables: FollowUnFollowUserMutationVariables) =>
      fetcher<
        FollowUnFollowUserMutationResponse,
        FollowUnFollowUserMutationVariables
      >(FollowUnFollowUserMutationDocument, variables)(),
    ...options,
  });
};