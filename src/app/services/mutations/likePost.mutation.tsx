import { useMutation } from "@tanstack/react-query";
import { fetcher } from "../../../graphql/fetcher";
import { Exact } from "../../../types/general";

// GraphQL mutation for liking/unliking a post
const POST_LIKE_POST_DOCUMENT = `
  mutation post_likePost($postId: Int!, $liked: Boolean!) {
    post_likePost(postId: $postId, liked: $liked) {
      status
    }
  }
`;

type Post_LikePostMutation = {
  __typename?: "Mutation";
  post_likePost?: {
    __typename?: "ResponseBaseOfPostLikes";
    status?: any | null;
  } | null;
};

type Post_LikePostMutationVariables = Exact<{
  postId: any;
  liked: boolean;
}>;

// Custom hook for liking/unliking a post using React Query's useMutation
export const useLikePost = () =>
  useMutation<Post_LikePostMutation, Error, Post_LikePostMutationVariables>({
    mutationFn: (variables) =>
      fetcher<Post_LikePostMutation, Post_LikePostMutationVariables>(
        POST_LIKE_POST_DOCUMENT,
        variables
      )(),
  });
