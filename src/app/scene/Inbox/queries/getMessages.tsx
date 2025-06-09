import { gql } from "graphql-request";
import { useInfiniteQuery } from "@tanstack/react-query";
import { graphqlFetcher } from "@/http/graphql.fetcher";

interface Sender {
  id: number;
  displayName: string;
  username: string;
  imageAddress: string;
  lastSeen: string;
};

interface Receiver {
  id: number;
  username: string;
  imageAddress: string;
  lastSeen: string;
};

interface Post {
  id: number;
  postItemsString: string;
  yourMind: string;
  createdDate: string;
  poster: Sender;
};

interface Story {
  id: number;
  contentAddress: string;
  storyType: string;
  createdDate: string;
  seenByCurrentUser: boolean;
  likedByCurrentUser: boolean;
  userId: number;
  user: Sender;
  text: string;
  textPositionX: string;
  textPositionY: string;
  textStyle: string;
};

export interface DirectMessage {
  id: number;
  messageType: string;
  text: string;
  contentAddress: string;
  createdDate: string;
  sender: Sender;
  receiver: Receiver;
  post?: Post;
  story?: Story;
  conversationId: string;
  daysRemainings: number;
  status?: string;
  parentMessage?: DirectMessage | null;
};

interface DirectMessageResult {
  items: DirectMessage[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

interface DirectMessageGetResponse {
  message_getDirectMessages: {
    result: DirectMessageResult;
    status: {
      code: number;
      value: string;
    }
  };
};

const MESSAGE_GET_DIRECT_MESSAGES_QUERY = gql`
  query message_getDirectMessages(
    $skip: Int!
    $take: Int!
    $conversationId: Int!
    $userId: Int!
    $order: [MessageDtoSortInput!]
  ) {
    message_getDirectMessages(userId: $userId, conversationid: $conversationId) {
      status
      result(
        skip: $skip,
        take: $take,
        order: $order
        ) {
        totalCount
        pageInfo {
            hasNextPage
            hasPreviousPage
          }
        items {
          id
          messageType
          text
          contentAddress
          createdDate
          daysRemainings
          conversationId
          sender {
            id
            displayName
            username
            imageAddress
            lastSeen
          }
          receiver {
            id
            username
            displayName
            imageAddress
            lastSeen
          }
          post {
            id
            postItemsString
            yourMind
            createdDate
            poster {
              id
              imageAddress
              username
              isVerified
            }
          }
          story {
            id
            text
            textPositionX
            textPositionY
            textStyle
            contentAddress
            storyType
            createdDate
            seenByCurrentUser
            likedByCurrentUser
            userId
            user {
              id
              username
              imageAddress
              displayName
            }
          }
          parentMessage {
            id
            messageType
            text
            contentAddress
            createdDate
            conversationId
            sender {
              id
              displayName
              username
              imageAddress
              lastSeen
            }
            receiver {
              id
              username
              displayName
              imageAddress
              lastSeen
            }
            post {
              id
              postItemsString
              yourMind
              createdDate
              poster {
                id
                imageAddress
                username
                isVerified
              }
            }
            story {
              id
              text
              textPositionX
              textPositionY
              textStyle
              contentAddress
              storyType
              createdDate
              seenByCurrentUser
              likedByCurrentUser
              userId
              user {
                id
                username
                imageAddress
                displayName
              }
            }
          }
        }
      }
    }
  }
`;

const useGetDirectMessages = ({
  userId,
  conversationId,
}: {
  userId?: number;
  conversationId?: number;
}) => {
  return useInfiniteQuery<DirectMessageGetResponse, Error, { messages: DirectMessage[], lastMsgId: number | null }>({
    queryKey: ["message_getDirectMessages", userId, conversationId],
    queryFn: ({ pageParam = 0 }) =>
      graphqlFetcher(MESSAGE_GET_DIRECT_MESSAGES_QUERY, {
        skip: pageParam,
        take: 100,
        userId,
        conversationId,
        order: [{ createdDate: "DESC" }],
      }),
    select(data) {
      const messages = (data?.pages?.flatMap((p) => p?.message_getDirectMessages?.result?.items) || []).reverse();
      const lastMsgId = data?.pages[data?.pages?.length - 1]?.message_getDirectMessages?.result?.items[0]?.id || null;
      return { messages, lastMsgId };
    },
    getNextPageParam: (lastPage, pages) => {
      const totalMessages = lastPage?.message_getDirectMessages?.result?.totalCount || 0;
      const currentCount = pages.length * 100;
      return currentCount < totalMessages ? currentCount : undefined;
    },
    initialPageParam: 0,
    enabled: false,
    gcTime: 0,
  });
};

export default useGetDirectMessages;
