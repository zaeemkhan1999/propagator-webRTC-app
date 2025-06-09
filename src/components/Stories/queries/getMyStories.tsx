import { useInfiniteQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphqlFetcher } from '../../../http/graphql.fetcher';
import { StoryTypes } from '../mutation/createMyStory';

export type MyStory = {
  id: number;
  storyType: StoryTypes;
  text: string;
  textPositionX: string;
  textPositionY: string;
  textStyle: string;
  link: string | null;
  contentAddress: string;
  duration: number;
  createdDate: string;
  likeCount: number;
  commentCount: number;
  storySeensCount: number;
  userId: number;
  post: Post;
};

export interface Post {
  id: number
  postItemsString: string;
  iconLayoutType: string;
  createdDate: string;
  yourMind: string;
  poster: {
    id: number;
    username: string;
    displayName: string;
    imageAddress: string;
  }
};

export interface StoryResult {
  items: MyStory[];
  totalCount: number;
}

export interface Story_GetMyStoriesResponse {
  story_getMyStories: {
    result: StoryResult;
    status: {
      code: number;
      value: string;
    };
  };
}

const GET_MY_STORIES_QUERY = gql`
  query story_getMyStories($skip: Int, $take: Int) {
    story_getMyStories {
      result(skip: $skip, take: $take) {
        items {
          id
          storyType
          text
          textPositionX
          textPositionY
          textStyle
          link
          contentAddress
          duration
          createdDate
          likeCount
          commentCount
          storySeensCount
          userId
          post {
            id
            postItemsString
            iconLayoutType
            createdDate
            yourMind
            bg
            aspectRatio
            poster{
              id
              username
              displayName
              imageAddress
            }
          }
        }
        totalCount
      }
      status
    }
  }
`;

export const useGetMyStories = () => {
  return useInfiniteQuery<Story_GetMyStoriesResponse, Error>({
    queryKey: ['story_getMyStories'],
    queryFn: ({ pageParam = 0 }) =>
      graphqlFetcher(GET_MY_STORIES_QUERY, {
        skip: pageParam,
        take: 1000,
      }),
    getNextPageParam: (lastPage, pages) => {
      const totalCount = lastPage?.story_getMyStories?.result?.totalCount || 0;
      const currentCount = pages.length * 10;
      return currentCount < totalCount ? currentCount : undefined;
    },
    initialPageParam: 0,
    enabled: false,
  });
};
