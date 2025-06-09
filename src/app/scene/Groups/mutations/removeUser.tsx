import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

// GraphQL mutation document for removing a user from a group
const MESSAGE_REMOVE_USER_FROM_GROUP_DOCUMENT = `
  mutation message_removeUserFromGroup($conversationId: Int!, $userId: Int!) {
    message_removeUserFromGroup(conversationId: $conversationId, userId: $userId) {
      code
      value
    }
  }
`;

// Define types for the remove user from group mutation result and variables
export type Message_RemoveUserFromGroupMutation = {
    message_removeUserFromGroup?: {
        code: number;
        value: string;
    };
};

export interface Message_RemoveUserFromGroupMutationVariables {
    conversationId: number;
    userId: number;
}

export const useRemoveUserFromGroup = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const removeUserFromGroup = async (
        variables: Message_RemoveUserFromGroupMutationVariables,
        onSuccess?: Function
    ) => {
        setLoading(true);
        setError(null);

        try {
            const fetchRemoveUserFromGroup = fetcher<
                Message_RemoveUserFromGroupMutation,
                Message_RemoveUserFromGroupMutationVariables
            >(MESSAGE_REMOVE_USER_FROM_GROUP_DOCUMENT, variables);
            const result = await fetchRemoveUserFromGroup();
            enqueueSnackbar(result?.message_removeUserFromGroup?.value, { variant: "success", autoHideDuration: 2000 });
            onSuccess?.();
        } catch (err: any) {
            setError(err);
            enqueueSnackbar(err?.message || "Some error occurred while removing user to group", { variant: "error", autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return { removeUserFromGroup, loading, error };
};
