import { useState } from "react";
import { fetcher } from "@/graphql/fetcher";
import { enqueueSnackbar } from "notistack";

type Story_LikeMutationVariables = {
    liked: boolean;
    storyId: number;
};

type Story_LikeMutation = {
    __typename?: "Mutation";
    story_likeStory?: {
        __typename?: "ResponseBase";
        status?: { code: number; value: string };
    };
};

const Story_LikeDocument = `
    mutation story_likeStory($liked: Boolean!, $storyId: Int!) {
        story_likeStory(liked: $liked, storyId: $storyId) {
            status
        }
    }
`;

export const useLikeUnlikeStory = () => {
    const [loading, setLoading] = useState(false);

    const likeUnlikeStory = async (storyId: number, liked: boolean, onSuccess?: Function) => {
        setLoading(true);

        try {
            const variables: Story_LikeMutationVariables = {
                liked,
                storyId,
            };

            const storyFetcher = fetcher<Story_LikeMutation, Story_LikeMutationVariables>(
                Story_LikeDocument,
                variables
            );
            const response = await storyFetcher();

            if (response.story_likeStory?.status?.code !== 1) {
                enqueueSnackbar(`Failed to ${liked ? "like" : "unlike"} story`, { variant: "error", autoHideDuration: 1000 });
            }

            onSuccess?.();
        } catch (err: any) {
            enqueueSnackbar(err?.message || `Failed to ${liked ? "like" : "unlike"} story`, { variant: "error", autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return { likeUnlikeStory, loading };
};
