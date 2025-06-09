import { useState } from "react";
import { fetcher } from "@/graphql/fetcher";
import { Post_CreatePostMutation, Post_CreatePostMutationVariables } from "@/types/general";
import { enqueueSnackbar } from "notistack";

const Post_CreatePostDocument = `
    mutation post_createPost($input: PostInput) {
      post_createPost(input: $input) {
        result {
          id
        }
        status
      }
    }
`;

const useCreatePost = () => {
  const [loading, setLoading] = useState(false);

  const createPost = async (variables: Post_CreatePostMutationVariables, onSuccess?: Function) => {
    setLoading(true);

    try {
      const createPostFetcher = fetcher<
        Post_CreatePostMutation,
        Post_CreatePostMutationVariables
      >(Post_CreatePostDocument, variables);
      const response = await createPostFetcher();

      onSuccess?.(response?.post_createPost?.result?.id);
    } catch (err: any) {
      enqueueSnackbar(err?.post_createPost?.status?.value, { variant: "error", autoHideDuration: 2000 });
    } finally {
      setLoading(false);
    };
  };

  return { createPost, loading };
};

export default useCreatePost;
