import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

// GraphQL mutation document for creating a group message
const MESSAGE_CREATE_GROUP_MESSAGE_DOCUMENT = `
  mutation message_createGroupMessage($messageInput: MessageInput!) {
    message_createGroupMessage(messageInput: $messageInput) {
      result {
        id
        profile {
          username
        }
        post {
          postItemsString
        }
        text
      }
      status
    }
  }
`;

// Define types for the create group message mutation result and variables
export type Message_CreateGroupMessageMutation = {
    message_createGroupMessage?: {
        result: {
            id: string;
            profile: {
                username: string;
            };
            post: {
                postItemsString: string;
            };
            text: string;
        };
        status: {
            code: number;
            value: string;
        };
    };
};

export interface Message_CreateGroupMessageMutationVariables {
    messageInput: {
        messageType: string;
        conversationId: number;
        groupTopicId: number | null;
        contentAddress: string;
        isShare: boolean;
        postId?: number;
        articleId?: number;
    };
}

export const useCreateGroupMessage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Function to execute the create group message mutation
    const createGroupMessage = async (
        variables: Message_CreateGroupMessageMutationVariables,
        onSuccess?: Function
    ) => {
        setLoading(true);
        setError(null);

        try {
            const fetchCreateGroupMessage = fetcher<
                Message_CreateGroupMessageMutation,
                Message_CreateGroupMessageMutationVariables
            >(MESSAGE_CREATE_GROUP_MESSAGE_DOCUMENT, variables);
            const result = await fetchCreateGroupMessage();
            enqueueSnackbar(result?.message_createGroupMessage?.status?.value, { variant: "success", autoHideDuration: 2000 });
            onSuccess?.();
        } catch (err: any) {
            setError(err);
            enqueueSnackbar(err?.message || "Some error occurred while creating the group message", { variant: "error", autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return { createGroupMessage, loading, error };
};
