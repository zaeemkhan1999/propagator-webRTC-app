import { wsClient } from "@/http/graphql.client";
import { gql } from "graphql-request";
import { SubscribePayload } from "graphql-ws";

export interface Message {
  id: number;
  conversationId: number;
  messageType: string;
  text: string;
  createdDate: string;
  receiverId: number;
  senderId: number;
}

export interface NotificationReceivedResponse {
  notificationReceived: {
    message: Message;
  };
}

export function subscribeToMessages(
  userId: number,
  onMessage: (data: NotificationReceivedResponse) => void,
  onError?: (error: any) => void,
): () => void {
  if (!wsClient) {
    throw new Error("WebSocket client is not initialized.");
  };

  const subscriptionQuery: SubscribePayload = {
    query: gql`
      subscription ($userId: Int!) {
        notificationReceived(userId: $userId) {
          message {
            id
            conversationId
            messageType
            text
            createdDate
            receiverId
            senderId
            isOnline
            isTyping
          }
        }
      }
    `,
    variables: { userId },
  };

  const unsubscribe = wsClient.subscribe<NotificationReceivedResponse>(
    subscriptionQuery,
    {
      next: (response) => {
        if (response.errors) {
          console.error("Subscription error:", response.errors);
          onError?.(response.errors);
          return;
        }
        if (!response.data) return;
        onMessage(response.data);
      },
      error: (error) => {
        console.error("Subscription error:", error);
        onError?.(error);
      },
      complete: () => console.log("Subscription completed"),
    },
  );

  return unsubscribe;
}
