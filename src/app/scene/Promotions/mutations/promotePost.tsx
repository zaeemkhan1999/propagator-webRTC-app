import { useState } from "react";
import { fetcher } from "@/graphql/fetcher";
import { enqueueSnackbar } from "notistack";

type Post_PromotePostMutation = {
    __typename?: "Mutation";
    post_promotePost?: {
        __typename?: "ResponseBase";
        result?: {
            clientSecret: string;
            post: {
                id: string;
            };
        };
        status: {
            code: number;
            value: string;
        };
    };
};

const Post_PromotePostDocument = `
  mutation post_promotePost($input: PromotePostInput) {
    post_promotePost(input: $input) {
      result {
        clientSecret
        post {
          id
        }
      }
      status
    }
  }
`;

export type PromotePostVariables = {
    discountCode: string;
    isWithOutPayment: boolean;
    postId: number;
    manualStatus: string;
    numberOfPeopleCanSee: number;
    targetLocation: string;
    visitType: string;
    targetStartAge: number;
    targetEndAge: number;
    targetGenders: string;
};

type Post_PromotePostMutationVariables = {
    input: PromotePostVariables;
};

export const usePromotePost = () => {
    const [loading, setLoading] = useState(false);

    const promotePost = async (input: PromotePostVariables, onSuccess?: (paymentIntentId?: string) => Promise<void> | void) => {
        setLoading(true);

        try {
            const variables: Post_PromotePostMutationVariables = { input };

            const promotePostFetcher = fetcher<Post_PromotePostMutation, Post_PromotePostMutationVariables>(
                Post_PromotePostDocument,
                variables
            );
            const response = await promotePostFetcher();

            if (response?.post_promotePost?.status?.code !== 1) {
                enqueueSnackbar(response?.post_promotePost?.status?.value || "Failed to promote post", { variant: "error", autoHideDuration: 3000 });
            } else {
                onSuccess?.(response?.post_promotePost?.result?.clientSecret);
                enqueueSnackbar("Post promoted successfully", { variant: "success", autoHideDuration: 3000 });
            }
        } catch (err: any) {
            enqueueSnackbar(err?.post_promotePost?.status?.value || "Failed to promote post", { variant: "error", autoHideDuration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return { promotePost, loading };
};
