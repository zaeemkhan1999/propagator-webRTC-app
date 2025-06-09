import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

const MESSAGE_CREATE_DIRECT_MESSAGE_DOCUMENT = `
  mutation message_createDirectMessage($input: MessageInput) {
    message_createDirectMessage(input: $input) {
      status
      result {
        id
        conversationId
      }
    }
  }
`;

export interface Message_CreateDirectMessageMutationVariables {
    input: MessageInput;
};

export enum MessageTypes {
    POST = "POST", ARTICLE = "ARTICLE", TEXT = 'TEXT', FILE = 'FILE', PHOTO = 'PHOTO', VIDEO = 'VIDEO', VOICE = 'VOICE', STORY = "STORY"
};

export interface MessageInput {
    messageType: MessageTypes;
    isShare: boolean;
    parentMessageId: number | null;
    conversationId: number | null;
    text: string;
    receiverId: number;
    contentAddress?: string;
    postId?: number;
    articleId?: number;
    storyId?: number;
};

export interface Message_CreateDirectMessageMutation {
    message_createDirectMessage: {
        status: {
            code: number;
            value: string;
        };
        result: {
            id: number;
            conversationId: number;
        }
    };
}

export const useAddDirectMessage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const addMessage = async (
        variables: Message_CreateDirectMessageMutationVariables,
        onSuccessCallback?: ({ id, conversationId }: { id: number, conversationId: number }) => void
    ) => {
        setLoading(true);

        try {
            const getData = fetcher<
                Message_CreateDirectMessageMutation,
                Message_CreateDirectMessageMutationVariables
            >(MESSAGE_CREATE_DIRECT_MESSAGE_DOCUMENT, variables);
            const result = await getData();
            if (result.message_createDirectMessage?.status?.code === 1) {
                onSuccessCallback?.({
                    id: result?.message_createDirectMessage?.result?.id,
                    conversationId: result?.message_createDirectMessage?.result?.conversationId
                });
            } else {
                enqueueSnackbar("Failed to send message", { variant: 'error', autoHideDuration: 2000 });
            };
        } catch (err: any) {
            enqueueSnackbar("An error occurred while sending the message", { variant: 'error', autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        };
    };

    return { addMessage, loading };
};
