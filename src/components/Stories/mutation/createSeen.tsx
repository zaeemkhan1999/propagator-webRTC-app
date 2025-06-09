import { fetcher } from "@/graphql/fetcher";
import { enqueueSnackbar } from "notistack";

type StorySeen_CreateStorySeenMutationVariables = {
    input: {
        storyId: number;
        ownerId?: number;
    };
};

type StorySeen_CreateStorySeenMutation = {
    __typename?: "Mutation";
    storySeen_createStorySeen?: {
        __typename?: "ResponseBase";
        status: {
            code: number;
            value: string;
        };
    };
};

const StorySeen_CreateStorySeenDocument = `
    mutation storySeen_createStorySeen($input: StorySeenInput!) {
        storySeen_createStorySeen(input: $input) {
            status
        }
    }
`;

export const useCreateStorySeen = () => {
    const createStorySeen = async (input: { storyId: number, ownerId?: number }, onSuccess?: Function) => {
        try {
            const variables: StorySeen_CreateStorySeenMutationVariables = {
                input,
            };

            const storySeenFetcher = fetcher<StorySeen_CreateStorySeenMutation, StorySeen_CreateStorySeenMutationVariables>(
                StorySeen_CreateStorySeenDocument,
                variables
            );
            const response = await storySeenFetcher();

            if (response.storySeen_createStorySeen?.status?.code !== 1) {
                enqueueSnackbar(response.storySeen_createStorySeen?.status?.value || "Failed to mark story as seen", { variant: "error", autoHideDuration: 2000 });
            } else {
                onSuccess?.();
            }
        } catch (err: any) {
            enqueueSnackbar(err?.message || "Failed to mark story as seen", { variant: "error", autoHideDuration: 2000 });
        }
    };

    return { createStorySeen };
};
