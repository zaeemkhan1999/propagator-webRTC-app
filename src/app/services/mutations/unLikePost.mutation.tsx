import { useMutation } from "@tanstack/react-query";
import { fetcher } from "../../../graphql/fetcher";
import { Exact } from "../../../types/general";

const POST_UNLIKE_POST_DOCUMENT = `
  mutation post_unLikePost($postId: Int!) {
    post_unLikePost(postId: $postId) {
      status
    }
  }
`;

type Post_UnLikePostMutation = {
  __typename?: "Mutation";
  post_unLikePost?: { __typename?: "ResponseBase"; status?: any | null } | null;
};

type Post_UnLikePostMutationVariables = Exact<{
  postId: number;
}>;

export const useUnLikePost = () =>
  useMutation<Post_UnLikePostMutation, Error, Post_UnLikePostMutationVariables>(
    {
      mutationFn: (variables) =>
        fetcher<Post_UnLikePostMutation, Post_UnLikePostMutationVariables>(
          POST_UNLIKE_POST_DOCUMENT,
          variables
        )(),
    }
  );
