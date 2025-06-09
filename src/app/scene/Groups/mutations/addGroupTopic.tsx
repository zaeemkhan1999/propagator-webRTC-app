import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

// GraphQL mutation document for adding a group topic
const MESSAGE_ADD_GROUP_TOPIC_DOCUMENT = `
  mutation message_addGroupTopic($conversationId: Int!, $title: String!) {
    message_addGroupTopic(conversationId: $conversationId, title: $title) {
      status
    }
  }
`;

// Define types for the add group topic mutation result and variables
export type Message_AddGroupTopicMutation = {
    message_addGroupTopic?: {
        status: {
            code: number;
            value: string;
        };
    };
};

export interface Message_AddGroupTopicMutationVariables {
    conversationId: number;
    title: string;
}

// TODO: use react-query
// Custom hook
export const useAddGroupTopic = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Function to execute the add group topic mutation
    const addGroupTopic = async (
        variables: Message_AddGroupTopicMutationVariables,
        onSuccess?: Function
    ) => {
        setLoading(true);
        setError(null);

        try {
            const fetchAddGroupTopic = fetcher<
                Message_AddGroupTopicMutation,
                Message_AddGroupTopicMutationVariables
            >(MESSAGE_ADD_GROUP_TOPIC_DOCUMENT, variables);
            const result = await fetchAddGroupTopic();
            enqueueSnackbar(result?.message_addGroupTopic?.status?.value, { variant: "success", autoHideDuration: 2000 });
            onSuccess?.();
        } catch (err: any) {
            setError(err);
            enqueueSnackbar(err?.message || "Some error occurred while adding group topic", { variant: "error", autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return { addGroupTopic, loading, error };
};
