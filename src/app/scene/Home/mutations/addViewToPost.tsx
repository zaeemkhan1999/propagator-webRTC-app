import { fetcher } from "../../../../graphql/fetcher";
import { enqueueSnackbar } from "notistack";

const POST_ADD_VIEW_TO_POSTS_DOCUMENT = `
  mutation post_addViewToPosts($postIds: [Int!]!) {
    post_addViewToPosts(postIds: $postIds) {
      status
    }
  }
`;

interface Post_AddViewToPostsMutationVariables {
    postIds: number[];
}

interface Post_AddViewToPostsMutation {
    post_addViewToPosts: {
        status: {
            code: number;
            value: string;
        };
    };
};

const useAddViewToPosts = () => {
    const addViewToPosts = async (
        variables: Post_AddViewToPostsMutationVariables,
        onSuccessCallback?: () => void
    ) => {
        try {
            const getData = fetcher<
                Post_AddViewToPostsMutation,
                Post_AddViewToPostsMutationVariables
            >(POST_ADD_VIEW_TO_POSTS_DOCUMENT, variables);

            const result = await getData();

            if (result.post_addViewToPosts?.status?.code === 1) {
                onSuccessCallback?.();
            } else {
                enqueueSnackbar(result?.post_addViewToPosts?.status?.value, { variant: 'error', autoHideDuration: 2000 });
            };
        } catch (err: any) {
            enqueueSnackbar(err?.result.post_addViewToPosts?.status?.value, { variant: 'error', autoHideDuration: 2000 });
        };
    };

    return { addViewToPosts };
};

export default useAddViewToPosts;
