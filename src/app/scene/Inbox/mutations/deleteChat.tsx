import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

// The GraphQL mutation document
const MESSAGE_REMOVE_CONVERSATION_DOCUMENT = `
  mutation message_removeConversation($conversationId: Int!) {
    message_removeConversation(conversationId: $conversationId) {
      code
      value
    }
  }
`;

export interface Message_RemoveConversationMutationVariables {
    conversationId: number; // The ID of the conversation to be removed
}

export interface Message_RemoveConversationMutation {
    message_removeConversation: {
        code: number;  // The response code from the mutation (e.g., "SUCCESS" or "ERROR")
        value: string; // The value or description of the response (could indicate success or error)
    };
}

// Custom hook for the remove conversation mutation
export const useDeleteConversation = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const deleteConversation = async (
        variables: Message_RemoveConversationMutationVariables,
        onSuccessCallback?: () => void
    ) => {
        setLoading(true);
        setError(null);

        try {
            // Call the fetcher function to send the mutation request
            const getData = fetcher<
                Message_RemoveConversationMutation,
                Message_RemoveConversationMutationVariables
            >(MESSAGE_REMOVE_CONVERSATION_DOCUMENT, variables);
            const result = await getData(); // Wait for the mutation result
            if (result.message_removeConversation?.code === 1) {
                if (onSuccessCallback) onSuccessCallback(); // Execute the success callback if provided
            } else {
                enqueueSnackbar("Failed to remove conversation", { variant: 'error', autoHideDuration: 2000 });
            }
        } catch (err: any) {
            setError(err); // Set error if something goes wrong
            enqueueSnackbar("An error occurred while removing the conversation", { variant: 'error', autoHideDuration: 2000 });
        } finally {
            setLoading(false); // Stop loading once the mutation is done
        }
    };

    return { deleteConversation, loading, error };
};
