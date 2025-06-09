import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";

// GraphQL query document for fetching group members
const MESSAGE_GET_GROUP_MEMBERS_DOCUMENT = `
  query message_getGroupMembers($conversationId: Int!, $where: UserMessageGroupFilterInput, $order: [UserMessageGroupSortInput!]) {
    message_getGroupMembers(conversationId: $conversationId) {
      result(where: $where, order: $order) {
        items {
          conversationId
          isAdmin
          user {
            legalName
            displayName
            username
            id
            imageAddress
          }
        }
        totalCount
      }
      status
    }
  }
`;

// Define types for the group member query result and variables
export type Message_GetGroupMembersQuery = {
  message_getGroupMembers?: {
    result?: {
      totalCount?: number;
      items?: Array<{
        conversationId: number;
        isAdmin: boolean;
        user: {
          legalName: string;
          displayName: string;
          username: string;
          id: number;
          imageAddress?: string;
        };
      }>;
    };
    status: {
      code: number;
      value: string;
    };
  };
};

export interface Message_GetGroupMembersQueryVariables {
  conversationId: number;
}

export interface MemberItem {
  conversationId: number;
  isAdmin: boolean;
  user: {
    legalName: string;
    displayName: string;
    username: string;
    id: number;
    imageAddress?: string;
  };
}

// TODO: use react-query
// Custom hook
export const useGetGroupMembers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<Message_GetGroupMembersQuery | null>(null);

  // Function to fetch group members
  const getGroupMembers = async (
    variables: Message_GetGroupMembersQueryVariables
  ) => {
    setLoading(true);
    setError(null);

    try {
      const fetchMembers = fetcher<
        Message_GetGroupMembersQuery,
        Message_GetGroupMembersQueryVariables
      >(MESSAGE_GET_GROUP_MEMBERS_DOCUMENT, variables);
      const result = await fetchMembers();
      setData(result);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Refetch function for re-fetching with new variables
  const refetch = (variables: Message_GetGroupMembersQueryVariables) => {
    getGroupMembers(variables);
  };

  return { getGroupMembers, loading, error, data, refetch };
};
