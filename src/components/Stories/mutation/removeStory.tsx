import { useState } from "react";
import { fetcher } from "@/graphql/fetcher";
import { enqueueSnackbar } from "notistack";

type Story_RemoveMutationVariables = {
    entityId: number;
};

type Story_RemoveMutation = {
    __typename?: "Mutation";
    story_removeStory?: {
        __typename?: "ResponseBase";
        code?: number;
        value?: string;
    };
};

const Story_RemoveDocument = `
    mutation story_removeStory($entityId: Int!) {
        story_removeStory(entityId: $entityId) {
            code
            value
        }
    }
`;

export const useRemoveStory = () => {
    const [loading, setLoading] = useState(false);

    const removeStory = async (entityId: number, onSuccess?: Function) => {
        setLoading(true);

        try {
            const variables: Story_RemoveMutationVariables = {
                entityId,
            };

            const storyFetcher = fetcher<Story_RemoveMutation, Story_RemoveMutationVariables>(
                Story_RemoveDocument,
                variables
            );
            const response = await storyFetcher();

            if (response.story_removeStory?.code !== 1) {
                enqueueSnackbar("Failed to remove story", { variant: "error", autoHideDuration: 2000 });
            } else {
                onSuccess?.();
                enqueueSnackbar("Story removed successfully", { variant: "success", autoHideDuration: 2000 });
            }
        } catch (err: any) {
            enqueueSnackbar(err?.message || "Failed to remove story", { variant: "error", autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return { removeStory, loading };
};
