import { useInfiniteQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { fetcher } from "../../../../graphql/fetcher";

// Define types for the group query result
export type Message_GetGroupsQuery = {
  __typename?: "Query";
  message_getGroups?: {
    __typename?: "GroupResponse";
    status?: { code: number, value: string };
    result?: {
      __typename?: "GroupResult";
      totalCount?: number;
      items?: Array<GroupItem>;
    };
  };
};

const MESSAGE_GET_GROUPS_QUERY = gql`
  query message_getGroups(
    $userId: Int,
    $skip: Int,
    $take: Int,
    $where: ConversationDtoFilterInput,
    $order: [ConversationDtoSortInput!]
  ) {
    message_getGroups(userId: $userId) {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        totalCount
        items {
          groupName
          groupImgageUrl
          groupMemberCount
          conversationId
          adminId
          isPrivate
          groupDescription
          latestMessageDate
          cover
          groupLink
          isMemberOfGroup
        }
      }
      status
    }
  }
`;

interface ConversationDtoFilterInput {
  isPrivate: {
    eq: boolean;
  };
  isMemberOfGroup?: {
    eq: boolean;
  };
  or?: [
    { groupName: { contains: string; } },
    { groupDescription: { contains: string; } },
  ]
}

interface Message_GetGroupsQueryVariables {
  userId?: number;
  skip: number;
  take: number;
  where: ConversationDtoFilterInput;
  order: [{
    latestMessageDate: "ASC" | "DESC",
  }]
}

export interface GroupItem {
  groupName: string;
  groupImgageUrl: string;
  groupMemberCount: number;
  conversationId: number;
  adminId: number;
  isPrivate: boolean;
  groupDescription: string;
  latestMessageDate: string;
  groupLink: string;
  isMemberOfGroup: boolean;
}

export const useGetGroups = ({
  userId,
  where,
  take = 10,
  skip = 0
}: {
  userId?: number;
  where: ConversationDtoFilterInput;
  take?: number;
  skip?: number;
}) => {
  return useInfiniteQuery<Message_GetGroupsQuery, Error>({
    queryKey: ['message_getGroups', userId, where],
    queryFn: ({ pageParam = skip }) =>
      fetcher<Message_GetGroupsQuery, Message_GetGroupsQueryVariables>(
        MESSAGE_GET_GROUPS_QUERY, {
        userId,
        skip: pageParam as number,
        take,
        where,
        order: [{ latestMessageDate: "DESC" }]
      })(),
    getNextPageParam: (lastPage, pages) => {
      const totalCount = lastPage?.message_getGroups?.result?.totalCount ?? 0;
      const totalFetchedCount = pages.reduce(
        (sum, page) =>
          sum + (page.message_getGroups?.result?.items?.length ?? 0),
        0
      );
      if (totalCount > totalFetchedCount) return totalFetchedCount;
      return undefined;
    },
    initialPageParam: 0,
    enabled: false,
  });
};
