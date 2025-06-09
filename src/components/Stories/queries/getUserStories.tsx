import { useInfiniteQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphqlFetcher } from '../../../http/graphql.fetcher';
import { StoryTypes } from '../mutation/createMyStory';
import { Post } from './getMyStories';

export type UserStory = {
  id: number;
  contentAddress: string;
  text: string;
  textPositionX: string;
  textPositionY: string;
  textStyle: string;
  link: string | null;
  storyType: StoryTypes;
  duration: number;
  createdDate: string;
  userId: number;
  likedByCurrentUser: boolean;
  seenByCurrentUser: boolean;
  user: {
    username: string;
    displayName: string;
    imageAddress: string;
  };
  post: Post;
};

export interface UserStoryItem {
  stories: UserStory[];
  storyCount: number;
}[];

interface UserStoryResult {
  totalCount: number;
  items: UserStoryItem[] | [];
};

export interface Story_GetUserStoryResponse {
  story_getStoryUser: {
    result: UserStoryResult;
    status: {
      code: number;
      value: string;
    };
  };
};

const GET_STORY_USER_QUERY = gql`
  query story_getStoryUser {
    story_getStoryUser {
      result {
      totalCount
        items {
          stories {
            id
            contentAddress
            text
            textPositionX
            textPositionY
            textStyle
            link
            storyType
            duration
            createdDate
            userId
            likedByCurrentUser
            seenByCurrentUser
            user {
              username
              displayName
              imageAddress
            }
            post {
              id
              postItemsString
              iconLayoutType
              createdDate
              bg
              aspectRatio
              yourMind
              poster{
                id
                username
                displayName
                imageAddress
              }
            }
          }
          storyCount
        }
      }
      status
    }
  }
`;

export const useGetUserStories = () => {
  return useInfiniteQuery<Story_GetUserStoryResponse, Error>({
    queryKey: ['story_getStoryUser'],
    queryFn: ({ pageParam = 0 }) =>
      graphqlFetcher(GET_STORY_USER_QUERY, {
        skip: pageParam,
        take: 1000,
      }),
    getNextPageParam: (lastPage, pages) => {
      const totalCount = lastPage?.story_getStoryUser?.result.totalCount || 0;
      const currentCount = pages.length * 1000;
      return currentCount < totalCount ? currentCount : undefined;
    },
    initialPageParam: 0,
    enabled: false,
  });
};
