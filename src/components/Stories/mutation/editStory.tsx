import { useState } from "react";
import { fetcher } from "@/graphql/fetcher";
import { enqueueSnackbar } from "notistack";
import { StoryTypes } from "./createMyStory";

type StoryUpdate_UpdateStoryMutationVariables = {
    input: {
        text: string;
        textPositionX: string;
        textPositionY: string;
        textStyle: string;
    };
};

type StoryUpdate_UpdateStoryMutation = {
    __typename?: "Mutation";
    story_updateStory?: {
        __typename?: "ResponseBase";
        status: {
            code: number;
            value: string;
        };
    };
};

const StoryUpdate_UpdateStoryDocument = `
    mutation story_updateStory($input: StoryInput!) {
        story_updateStory(input: $input) {
            status
        }
    }
`;

export const useUpdateStory = () => {
    const [loading, setLoading] = useState(false);

    const updateStory = async (input: {
        id: number;
        text: string;
        textPositionX: string;
        textPositionY: string;
        textStyle: string;
        storyType: StoryTypes;
        contentAddress: string;
    }, onSuccess?: Function) => {

        setLoading(true);
        try {
            const storyUpdateFetcher = fetcher<StoryUpdate_UpdateStoryMutation, StoryUpdate_UpdateStoryMutationVariables>(
                StoryUpdate_UpdateStoryDocument, { input }
            );
            const response = await storyUpdateFetcher();

            if (response.story_updateStory?.status?.code === 1) {
                enqueueSnackbar("Story updated successfully! ", { variant: "success", autoHideDuration: 2000 });
                onSuccess?.();
            } else {
                enqueueSnackbar(response?.story_updateStory?.status?.value || "Failed to update story", { variant: "error", autoHideDuration: 2000 });
            }
        } catch (err: any) {
            enqueueSnackbar(err?.story_updateStory?.status?.value || "Failed to update story", { variant: "error", autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        };
    };

    return { updateStory, loading };
};
