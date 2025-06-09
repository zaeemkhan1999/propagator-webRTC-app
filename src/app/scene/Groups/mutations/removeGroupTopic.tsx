import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

// GraphQL mutation document for removing a group topic
const MESSAGE_REMOVE_GROUP_TOPIC_DOCUMENT = `
  mutation message_removeGroupTopic($groupTopicId: Int!) {
    message_removeGroupTopic(groupTopicId: $groupTopicId) {
      code
      value
    }
  }
`;

// Define types for the remove group topic mutation result and variables
export type Message_RemoveGroupTopicMutation = {
    message_removeGroupTopic?: {
        code: number;
        value: string;
    };
};

export interface Message_RemoveGroupTopicMutationVariables {
    groupTopicId: number;
}

// TODO: use react-query
// Custom hook
export const useRemoveGroupTopic = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Function to execute the remove group topic mutation
    const removeGroupTopic = async (
        variables: Message_RemoveGroupTopicMutationVariables,
        onSuccess?: Function
    ) => {
        setLoading(true);
        setError(null);

        try {
            const fetchRemoveGroupTopic = fetcher<
                Message_RemoveGroupTopicMutation,
                Message_RemoveGroupTopicMutationVariables
            >(MESSAGE_REMOVE_GROUP_TOPIC_DOCUMENT, variables);
            const result = await fetchRemoveGroupTopic();
            enqueueSnackbar(result?.message_removeGroupTopic?.value, { variant: "success", autoHideDuration: 2000 });
            onSuccess?.();
        } catch (err: any) {
            setError(err);
            enqueueSnackbar(err?.message || "Some error occurred while removing group topic", { variant: "error", autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return { removeGroupTopic, loading, error };
};
