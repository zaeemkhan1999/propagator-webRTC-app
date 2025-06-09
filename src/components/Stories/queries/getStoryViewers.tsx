import { useInfiniteQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphqlFetcher } from '../../../http/graphql.fetcher';
import { User } from './getStoryComments';

export type StorySeen = {
  id: number;
  user: User;
  isLiked: boolean;
};

interface StorySeenResult {
  items: StorySeen[];
  totalCount: number;
}

interface StorySeen_GetStorySeensResponse {
  storySeen_getStorySeens: {
    result: StorySeenResult;
    status: {
      code: number;
      value: string;
    };
  };
}

const GET_STORY_SEENS_QUERY = gql`
  query storySeen_getStorySeens($skip: Int, $take: Int, $where: StorySeenDtoFilterInput, $order: [StorySeenDtoSortInput!]) {
    storySeen_getStorySeens {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        items {
          id
          isLiked
          user {
            id
            imageAddress
            username
            displayName
          }
        }
        totalCount
      }
      status
    }
  }
`;

export const useGetStoryViewers = (storyId: number) => {
  return useInfiniteQuery<StorySeen_GetStorySeensResponse, Error>({
    queryKey: ['storySeen_getStorySeens', storyId],
    queryFn: ({ pageParam = 0 }) =>
      graphqlFetcher(GET_STORY_SEENS_QUERY, {
        skip: pageParam,
        take: 10,
        where: { storyId: { eq: storyId } },
        order: [{ isLiked: "DESC" }]
      }),
    getNextPageParam: (lastPage, pages) => {
      const totalCount = lastPage?.storySeen_getStorySeens?.result?.totalCount || 0;
      const currentCount = pages.length * 10;
      return currentCount < totalCount ? currentCount : undefined;
    },
    initialPageParam: 0,
    enabled: false
  });
};
