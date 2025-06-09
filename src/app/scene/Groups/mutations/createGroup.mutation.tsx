import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import {
  Message_CreateConversationGroupMutation,
  Message_CreateConversationGroupMutationVariables,
} from "../../../../types/general";
import { useSnackbar } from "notistack";

const MESSAGE_CREATE_CONVERSATION_GROUP_DOCUMENT = `
  mutation message_createConversationGroup($input: GroupMessageInput, $userIds: [Int!]) {
    message_createConversationGroup(input: $input, userIds: $userIds) {
      status
    }
  }
`;

export const useCreateConversationGroupMutation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const createConversationGroup = async (variables: Message_CreateConversationGroupMutationVariables, onSuccess?: Function) => {
    setLoading(true);

    try {
      const getData = fetcher<
        Message_CreateConversationGroupMutation,
        Message_CreateConversationGroupMutationVariables
      >(MESSAGE_CREATE_CONVERSATION_GROUP_DOCUMENT, variables);
      const result = await getData();
      if (result?.message_createConversationGroup?.status?.code === 1) {
        onSuccess?.();
        enqueueSnackbar("Group Created", { variant: "success", autoHideDuration: 3000, });
      } else {
        enqueueSnackbar(result?.message_createConversationGroup?.status?.value || "Error creating group", { variant: "error", autoHideDuration: 3000, });
      }
    } catch (err: any) {
      enqueueSnackbar(err?.message_createConversationGroup?.status?.value || "Error creating group", { variant: "error", autoHideDuration: 3000, });
    } finally {
      setLoading(false);
    }
  };

  return { createConversationGroup, loading };
};
