import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

// The GraphQL mutation document
const POST_REMOVE_POST_DOCUMENT = `
  mutation post_removePost($entityId: Int!) {
    post_removePost(entityId: $entityId) {
      code
      value
    }
  }
`;

export interface Post_RemovePostMutationVariables {
    entityId: number;
}

export interface Post_RemovePostMutation {
    post_removePost: {
        code: number;
        value: string;
    };
}

// Custom hook for the remove post mutation
export const useDeletePost = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const deletePost = async (
        variables: Post_RemovePostMutationVariables,
        onSuccessCallback?: Function
    ) => {
        setLoading(true);
        setError(null);

        try {
            const getData = fetcher<
                Post_RemovePostMutation,
                Post_RemovePostMutationVariables
            >(POST_REMOVE_POST_DOCUMENT, variables);
            const result = await getData();
            if (result.post_removePost?.code === 1) {
                onSuccessCallback?.();
                enqueueSnackbar(result.post_removePost?.value, { variant: 'success', autoHideDuration: 2000 });
            } else {
                enqueueSnackbar(result.post_removePost?.value, { variant: 'error', autoHideDuration: 2000 });
            };
        } catch (err: any) {
            setError(err);
            enqueueSnackbar(err?.post_removePost?.value || "An error occurred while removing the post", { variant: 'error', autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        };
    };

    return { deletePost, loading, error };
};
