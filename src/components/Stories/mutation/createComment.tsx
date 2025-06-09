import { useState } from "react";
import { fetcher } from "@/graphql/fetcher";
import { enqueueSnackbar } from "notistack";

type Story_CreateCommentMutationVariables = {
    input: {
        storyId: number;
        text: string;
    };
};

type Story_CreateCommentMutation = {
    __typename?: "Mutation";
    story_createComment?: {
        __typename?: "ResponseBase";
        status: {
            code: number;
            value: string;
        };
    };
};

const Story_CreateCommentDocument = `
    mutation story_createComment($input: StoryCommentInput!) {
        story_createComment(input: $input) {
            status
        }
    }
`;

export const useCreateComment = () => {
    const [loading, setLoading] = useState(false);

    const createComment = async (input: { storyId: number; text: string }, onSuccess?: Function) => {
        setLoading(true);

        try {
            const variables: Story_CreateCommentMutationVariables = {
                input,
            };

            const commentFetcher = fetcher<Story_CreateCommentMutation, Story_CreateCommentMutationVariables>(
                Story_CreateCommentDocument,
                variables
            );
            const response = await commentFetcher();

            if (response.story_createComment?.status?.code !== 1) {
                enqueueSnackbar(response.story_createComment?.status?.value || "Failed to create comment", { variant: "error", autoHideDuration: 2000 });
            } else {
                onSuccess?.();
                enqueueSnackbar("Comment added successfully", { variant: "success", autoHideDuration: 2000 });
            }
        } catch (err: any) {
            enqueueSnackbar(err?.message || "Failed to create comment", { variant: "error", autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return { createComment, loading };
};
