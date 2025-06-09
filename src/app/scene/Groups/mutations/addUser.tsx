import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

// GraphQL mutation document for adding a user to a group
const MESSAGE_ADD_USER_TO_GROUP_DOCUMENT = `
  mutation message_addUserToGroup($conversationId: Int!, $userIds: [Int!]!) {
    message_addUserToGroup(conversationId: $conversationId, userIds: $userIds) {
      code
      value
    }
  }
`;

// Define types for the add user to group mutation result and variables
export type Message_AddUserToGroupMutation = {
    message_addUserToGroup?: {
        code: number;
        value: string;
    };
};

export interface Message_AddUserToGroupMutationVariables {
    conversationId: number;
    userIds: number[];
}

// TODO: use react-query
// Custom hook
export const useAddUserToGroup = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<null | Message_AddUserToGroupMutation>(null);

    // Function to execute the add user to group mutation
    const addUserToGroup = async (
        variables: Message_AddUserToGroupMutationVariables,
        onSuccess?: Function
    ) => {
        setLoading(true);
        setError(null);

        try {
            const fetchAddUserToGroup = fetcher<
                Message_AddUserToGroupMutation,
                Message_AddUserToGroupMutationVariables
            >(MESSAGE_ADD_USER_TO_GROUP_DOCUMENT, variables);
            const result = await fetchAddUserToGroup();
            setData(result);
            enqueueSnackbar(result?.message_addUserToGroup?.value, { variant: "success", autoHideDuration: 2000 });
            onSuccess?.();
        } catch (err: any) {
            setError(err);
            enqueueSnackbar(err?.message || "Some error occurred while adding user to group", { variant: "error", autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return { addUserToGroup, loading, error, data };
};
