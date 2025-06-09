import { useInfiniteQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphqlFetcher } from '../../../http/graphql.fetcher';

export type User = {
  id: number;
  username: string;
  displayName: string;
  imageAddress: string;
};

export type StoryComment = {
  id: number;
  user: User;
  text: string;
};

interface StoryCommentResult {
  items: StoryComment[];
  totalCount: number;
}

interface StoryComment_GetStoryCommentsResponse {
  storyComment_getStoryComments: {
    result: StoryCommentResult;
    status: {
      code: number;
      value: string;
    };
  };
}

const GET_STORY_COMMENTS_QUERY = gql`
  query storyComment_getStoryComments($skip: Int, $take: Int, $where: StoryCommentFilterInput) {
    storyComment_getStoryComments {
      result(skip: $skip, take: $take, where: $where) {
        totalCount
        items {
          id
          text
          user {
            id
            username
            displayName
            imageAddress
          }
        }
      }
      status
    }
  }
`;

export const useGetStoryComments = (storyId: number) => {
  return useInfiniteQuery<StoryComment_GetStoryCommentsResponse, Error>({
    queryKey: ['storyComment_getStoryComments', storyId],
    queryFn: ({ pageParam = 0 }) =>
      graphqlFetcher(GET_STORY_COMMENTS_QUERY, {
        skip: pageParam,
        take: 10,
        where: { storyId: { eq: storyId } },
      }),
    getNextPageParam: (lastPage, pages) => {
      const totalCount = lastPage?.storyComment_getStoryComments?.result?.items.length || 0;
      const currentCount = pages.length * 10;
      return currentCount < totalCount ? currentCount : undefined;
    },
    initialPageParam: 0,
    enabled: false
  });
};
