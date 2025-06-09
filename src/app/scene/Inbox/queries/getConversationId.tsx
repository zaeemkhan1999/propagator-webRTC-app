import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { enqueueSnackbar } from "notistack";

// The GraphQL query document
const MESSAGE_GET_CONVERSATION_WITH_OTHER_USER_DOCUMENT = `
  query message_getConversationWithOtherUser($otherUserId: Int!) {
    message_getConversationWithOtherUser(otherUserId: $otherUserId) {
      result {
        id
      }
        status
    }
  }
`;

export interface Message_GetConversationWithOtherUserQueryVariables {
  otherUserId: number;
}

export interface Message_GetConversationWithOtherUserQuery {
  message_getConversationWithOtherUser: {
    result: {
      id: number;
    };
    status: {
      code: number;
      value: string;
    };
  };
}

// Custom hook for fetching the conversation with another user
export const useGetConversationWithOtherUser = () => {
  const [loading, setLoading] = useState(false);

  const getConversationId = async (
    variables: Message_GetConversationWithOtherUserQueryVariables,
    onSuccessCallback?: (id: number | null) => void,
  ) => {
    setLoading(true);

    try {
      // Call the fetcher function to send the query request
      const getData = fetcher<
        Message_GetConversationWithOtherUserQuery,
        Message_GetConversationWithOtherUserQueryVariables
      >(MESSAGE_GET_CONVERSATION_WITH_OTHER_USER_DOCUMENT, variables);

      const result = await getData();
      onSuccessCallback?.(
        result?.message_getConversationWithOtherUser?.result?.id ?? 0,
      );
    } catch (err) {
      console.error(err);
      enqueueSnackbar("An error occurred while fetching the conversation", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return { getConversationId, loading };
};
