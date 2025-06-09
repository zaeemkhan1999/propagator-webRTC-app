import { useState } from "react";
import { fetcher } from "@/graphql/fetcher";
import { enqueueSnackbar } from "notistack";

type Post_CreatePostAdsMutation = {
    __typename?: "Mutation";
    post_createPostAds?: {
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

const Post_CreatePostAdsDocument = `
  mutation post_createPostAds($input: PostAdsInput) {
    post_createPostAds(input: $input) {
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

export type CreatePostAdVariables = {
    allowDownload: boolean;
    postItems: {
        postItemType: string;
        content: string;
        thumNail: string;
        order: number;
        width: number;
        height: number;
    }[];
    yourMind: string;
    manualStatus: string;
    visitType: string;
    isWithOutPayment: boolean;
    targetStartAge: number;
    targetEndAge: number;
    targetGenders: string;
    numberOfPeopleCanSee: number;
    iconLayoutType: string;
    location: string;
    tags: string[];
    discountCode: string;
    targetLocation: string;
}

type Post_CreatePostAdsMutationVariables = {
    input: CreatePostAdVariables
};

export const useCreatePostAd = () => {
    const [loading, setLoading] = useState(false);

    const createPostAd = async (input: CreatePostAdVariables, onSuccess?: (id?: string) => Promise<void> | void) => {
        setLoading(true);

        try {
            const variables: Post_CreatePostAdsMutationVariables = {
                input,
            };

            const postAdFetcher = fetcher<Post_CreatePostAdsMutation, Post_CreatePostAdsMutationVariables>(
                Post_CreatePostAdsDocument,
                variables
            );
            const response = await postAdFetcher();

            if (response.post_createPostAds?.status?.code !== 1) {
                enqueueSnackbar(response.post_createPostAds?.status?.value || "Failed to create promotion", { variant: "error", autoHideDuration: 3000 });
            } else {
                onSuccess?.(response?.post_createPostAds?.result?.clientSecret || '');
                enqueueSnackbar("Promotion created successfully", { variant: "success", autoHideDuration: 3000 });
            }
        } catch (err: any) {
            enqueueSnackbar(err?.message || "Failed to create promotion", { variant: "error", autoHideDuration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return { createPostAd, loading };
};
