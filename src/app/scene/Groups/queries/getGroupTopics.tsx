import { useInfiniteQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphqlFetcher } from '../../../../http/graphql.fetcher';

export interface GroupTopic {
  id: number;
  title: string;
}

interface GroupTopicResult {
  totalCount: number;
  items: GroupTopic[];
}

interface GroupTopicsResponse {
  message_getGroupTopics: {
    result: GroupTopicResult;
    status: {
      code: number;
      value: string;
    };
  };
}

const MESSAGE_GET_GROUP_TOPICS_QUERY = gql`
  query message_getGroupTopics(
    $conversationId: Int!
  ) {
    message_getGroupTopics(conversationId: $conversationId) {
      result {
        totalCount
        items {
          id
          title
        }
      }
      status
    }
  }
`;

// Custom hook to fetch group topics with pagination
export const useGetGroupTopics = ({ conversationId }: { conversationId: number; }) => {
  return useInfiniteQuery<GroupTopicsResponse, Error>({
    queryKey: ['message_getGroupTopics', conversationId],
    queryFn: ({ pageParam = 0 }) =>
      graphqlFetcher(MESSAGE_GET_GROUP_TOPICS_QUERY, {
        skip: pageParam,
        take: 10,
        conversationId,
      }),
    getNextPageParam: (lastPage, pages) => {
      const totalCount = lastPage?.message_getGroupTopics?.result?.totalCount || 0;
      const currentCount = pages.length * 10;
      return currentCount < totalCount ? currentCount : undefined;
    },
    initialPageParam: 0,
    enabled: false,
  });
};
