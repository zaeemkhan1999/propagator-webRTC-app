import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { enqueueSnackbar } from "notistack";

// Define the types for the mutation
type Message_UpdateGroupMutation = {
  message_updateGroup: {
    code: number;
    value: string;
  };
};

type GroupInput = {
  groupName: string;
  groupDescription: string | null;
  groupImgageUrl: string | null;
  groupLink: string | null;
  isPrivate: boolean;
  conversationId: number;
};

type Message_UpdateGroupMutationVariables = {
  input: GroupInput;
};

// The GraphQL mutation document for updating a group
const MESSAGE_UPDATE_GROUP_DOCUMENT = `
  mutation message_updateGroup($input: GroupInput) {
    message_updateGroup(input: $input) {
      code
      value
    }
  }
`;

export const useUpdateGroupMutation = () => {
  const [loading, setLoading] = useState(false);

  const updateGroup = async (
    variables: Message_UpdateGroupMutationVariables,
    onSuccess?: Function
  ) => {
    setLoading(true);

    try {
      const getData = fetcher<
        Message_UpdateGroupMutation,
        Message_UpdateGroupMutationVariables
      >(MESSAGE_UPDATE_GROUP_DOCUMENT, variables);
      const result = await getData();

      if (result?.message_updateGroup?.code === 1) {
        onSuccess?.();
        enqueueSnackbar("Group updated successfully!", {
          variant: "success",
          autoHideDuration: 2000,
        });
      } else {
        enqueueSnackbar("Failed to update group", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    } catch (err: any) {
      enqueueSnackbar("Failed to update group", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateGroup, loading };
};
