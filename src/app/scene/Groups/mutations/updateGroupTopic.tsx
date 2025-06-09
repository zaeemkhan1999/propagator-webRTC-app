import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

// GraphQL mutation document for updating a group topic
const MESSAGE_UPDATE_GROUP_TOPIC_DOCUMENT = `
  mutation message_updateGroupTopic($groupTopicId: Int!, $title: String!) {
    message_updateGroupTopic(groupTopicId: $groupTopicId, title: $title) {
      status
    }
  }
`;

// Define types for the update group topic mutation result and variables
export type Message_UpdateGroupTopicMutation = {
    message_updateGroupTopic?: {
        status: {
            code: number;
            value: string;
        };
    };
};

export interface Message_UpdateGroupTopicMutationVariables {
    groupTopicId: number;
    title: string;
}

// TODO: use react-query
// Custom hook
export const useUpdateGroupTopic = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Function to execute the update group topic mutation
    const updateGroupTopic = async (
        variables: Message_UpdateGroupTopicMutationVariables,
        onSuccess?: Function
    ) => {
        setLoading(true);
        setError(null);

        try {
            const fetchUpdateGroupTopic = fetcher<
                Message_UpdateGroupTopicMutation,
                Message_UpdateGroupTopicMutationVariables
            >(MESSAGE_UPDATE_GROUP_TOPIC_DOCUMENT, variables);
            const result = await fetchUpdateGroupTopic();
            enqueueSnackbar(result?.message_updateGroupTopic?.status?.value, { variant: "success", autoHideDuration: 2000 });
            onSuccess?.();
        } catch (err: any) {
            setError(err);
            enqueueSnackbar(err?.message || "Some error occurred while updating group topic", { variant: "error", autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return { updateGroupTopic, loading, error };
};
