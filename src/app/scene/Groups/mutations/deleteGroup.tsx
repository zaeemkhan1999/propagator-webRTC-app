import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";

// GraphQL mutation document for removing a conversation
const MESSAGE_REMOVE_CONVERSATION_DOCUMENT = `
  mutation message_removeConversation($conversationId: Int!) {
    message_removeConversation(conversationId: $conversationId) {
      code
      value
    }
  }
`;

// Define types for the remove conversation mutation result and variables
export type Message_RemoveConversationMutation = {
  message_removeConversation?: {
    code: number;
    value: string;
  };
};

export interface Message_RemoveConversationMutationVariables {
  conversationId: number;
}
// TODO: use react-query
// Custom hook
export const useRemoveGroup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to execute the remove conversation mutation
  const deleteGroup = async (
    variables: Message_RemoveConversationMutationVariables
  ) => {
    setLoading(true);
    setError(null);

    try {
      const fetchRemoveConversation = fetcher<
        Message_RemoveConversationMutation,
        Message_RemoveConversationMutationVariables
      >(MESSAGE_REMOVE_CONVERSATION_DOCUMENT, variables);
      await fetchRemoveConversation();
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { deleteGroup, loading, error };
};
