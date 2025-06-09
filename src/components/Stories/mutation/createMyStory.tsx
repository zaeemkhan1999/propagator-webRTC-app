import { useState } from "react";
import { fetcher } from "@/graphql/fetcher";
import { enqueueSnackbar } from "notistack";
import useUploadToAws from "@/hooks/useUploadToAws";

type Story_CreateMutation = {
    __typename?: "Mutation";
    story_createStory?: {
        __typename?: "ResponseBaseOfStory";
        status?: { code: number; value: string };
    };
};

const Story_CreateDocument = `
    mutation story_createStory($input: StoryInput) {
      story_createStory(input: $input) {
        status
      }
    }
`;

export enum StoryTypes { IMAGE = "IMAGE", VIDEO = "VIDEO", TEXT = "TEXT", ARTICLE = "ARTICLE", POST = "POST" };

type StoryStoryVariables = {
    input: {
        storyType: StoryTypes;
        contentAddress?: string;
        duration?: number;
        text?: string;
        textPositionX?: string;
        textPositionY?: string;
        textStyle?: string;
        postId?: number;
    };
};

const create = async (variables: StoryStoryVariables) => {
    const storyFetcher = fetcher<Story_CreateMutation, StoryStoryVariables>(
        Story_CreateDocument,
        variables
    );
    const response = await storyFetcher();

    if (response.story_createStory?.status?.code !== 1) {
        enqueueSnackbar("Failed to create story", { variant: "error", autoHideDuration: 2000 });
    } else {
        enqueueSnackbar("Story created successfully!", { variant: "success", autoHideDuration: 2000 });
    }
};

export const useCreateMyStory = () => {
    const { uploadToAws } = useUploadToAws();

    const [loading, setLoading] = useState(false);

    const createMyStory = async (vars: {
        postId?: number, text?: string, textPositionX?: string, textPositionY?: string, textStyle?: string, storyType?: StoryTypes
    }, files: File[] | null, onSuccess?: Function) => {
        setLoading(true);

        try {
            if (!vars.postId && files?.length) {
                for (let i = 0; i < files.length; i++) {
                    const uploadedMedia = await uploadToAws(files[i]);
                    const storyType = vars?.storyType ?? (files[i].type.startsWith("video/") ? StoryTypes.VIDEO : StoryTypes.IMAGE);

                    await create({
                        input: {
                            duration: 5,
                            text: vars?.text || '',
                            textPositionX: vars?.textPositionX || '',
                            textPositionY: vars?.textPositionY || '',
                            textStyle: vars?.textStyle || '',
                            storyType,
                            contentAddress: uploadedMedia,
                        },
                    });
                }
            } else if (vars.postId) {
                await create({
                    input: {
                        storyType: StoryTypes.POST,
                        postId: vars.postId,
                    },
                });
            };

            onSuccess?.();
        } catch (err: any) {
            enqueueSnackbar(err?.message || "Failed to create story", { variant: "error", autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return { createMyStory, loading };
};
