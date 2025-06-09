import { useInfiniteQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphqlFetcher } from '../../../../http/graphql.fetcher';

interface LastMessage {
  messageType: string;
  text: string;
  contentAddress: string;
  senderId: number;
}

export interface UserMessage {
  conversationId: number;
  userId: string;
  username: string;
  imageAddress: string;
  displayName: string;
  lastSeen: string;
  unreadCount: number;
  latestMessageDate: string;
  lastMessage: LastMessage;
}

interface MessageResult {
  items: UserMessage[];
  totalCount: number;
}

interface MessageGetUserMessagesResponse {
  message_getUserMessages: {
    result: MessageResult;
    status: string;
  };
}

const MESSAGE_GET_USER_MESSAGES_QUERY = gql`
  query message_getUserMessages(
    $skip: Int, 
    $take: Int, 
    $where: ConversationDtoFilterInput, 
    $order: [ConversationDtoSortInput!], 
    $userId: Int
  ) {
    message_getUserMessages(userId: $userId) {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        items {
          conversationId
          userId
          username
          imageAddress
          displayName
          lastSeen
          unreadCount
          latestMessageDate
          lastMessage {
            messageType
            text
            contentAddress
            senderId
          }
        }
        totalCount
      }
      status
    }
  }
`;

export const useGetMessageUsers = ({ userId, searchTerm }: { userId?: number; searchTerm: string }) => {
  return useInfiniteQuery<MessageGetUserMessagesResponse, Error>({
    queryKey: ['message_getUserMessages', userId, searchTerm],
    queryFn: ({ pageParam = 0 }) =>
      graphqlFetcher(MESSAGE_GET_USER_MESSAGES_QUERY, {
        skip: pageParam,
        take: 10,
        userId,
        where: {
          isGroup: { eq: false },
          or: [
            {
              username: { contains: searchTerm }
            },
            {
              displayName: { contains: searchTerm }
            }
          ],
        },
        order: [{
          latestMessageDate: "DESC",
        }],
      }),
    getNextPageParam: (lastPage, pages) => {
      const totalMessages = lastPage?.message_getUserMessages?.result?.totalCount || 0;
      const currentCount = pages.length * 10;
      return currentCount < totalMessages ? currentCount : undefined;
    },
    initialPageParam: 0,
    enabled: false,
  });
};
