import { useState } from "react";
import { fetcher } from "@/graphql/fetcher";
import { enqueueSnackbar } from "notistack";

type ConversationExportMutation = {
  __typename?: "Mutation";
  conversation_export?: {
    __typename?: "ResponseBaseOfConversationExport";
    status?: { code: number; value: string };
    result?: {
      messageJson: {
        text: string;
        senderId: number;
        sender: { displayName: string; legalName: string; username: string };
        receiver: { displayName: string; legalName: string; username: string };
        receiverId: number;
        createdDate: any;
      };
      expirtyDate: string;
      userID: number;
    };
  };
};

const ConversationExportDocument = `
    mutation conversationExport($conversationId: Int!) {
        conversation_export(conversationId: $conversationId) {
            result {
                messageJson {
                    text
                    senderId
                    createdDate
                    sender {
                        displayName
                        legalName
                        username
                    }
                    receiver {
                        displayName
                        legalName
                        username
                    }
                    receiverId
                }
                expirtyDate
                userID
            }
            status
        }
    }
`;

type ConversationExportVariables = {
  conversationId: number;
};

export const useExportConversation = () => {
  const [loading, setLoading] = useState(false);

  const exportMyConversation = async (conversationId: number, onSuccess?: Function) => {
    setLoading(true);

    try {
      const conversationFetcher = fetcher<ConversationExportMutation, ConversationExportVariables>(
        ConversationExportDocument,
        { conversationId }
      );
      const response = await conversationFetcher();

      if (response.conversation_export?.status?.code !== 1) {
        enqueueSnackbar("Failed to export conversation", { variant: "error", autoHideDuration: 2000 });
      } else {
        enqueueSnackbar("Conversation exported successfully!", { variant: "success", autoHideDuration: 2000 });
        onSuccess?.(response?.conversation_export?.result?.messageJson);
      }
    } catch (err: any) {
      enqueueSnackbar(err?.message || "Failed to export conversation", { variant: "error", autoHideDuration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return { exportMyConversation, loading };
};