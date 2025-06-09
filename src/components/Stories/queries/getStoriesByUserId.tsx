import { gql } from 'graphql-request';
import { useState } from 'react';
import config from '@/config/index.dev';
import { getToken } from '@/http/graphql.client';
import { enqueueSnackbar } from 'notistack';
import { StoryTypes } from '../mutation/createMyStory';

type Story = {
  id: number;
  storySeensCount: number;
  likeCount: number;
  commentCount: number;
  userId: number;
  contentAddress: string;
  createdDate: string;
  duration: number;
  storyType: StoryTypes;
  text: string;
  seenByCurrentUser: boolean;
  likedByCurrentUser: boolean;
  textPositionX: string;
  textPositionY: string;
  textStyle: string;
  link: string | null;
  post: Post;
};

interface Post {
  id: number;
  postItemsString: string;
  iconLayoutType: string;
  createdDate: string;
  yourMind: string;
  bg: string;
  aspectRatio: string;
  poster: {
    id: number;
    username: string;
    displayName: string;
    imageAddress: string;
  };
};

const GET_STORIES_QUERY = gql`
  query story_getStories ($userId: Int!) {
    story_getStories() {
      result(where: { userId: { eq: $userId } }) {
        items {
          id
          storySeensCount
          likeCount
          commentCount
          userId
          contentAddress
          createdDate
          duration
          storyType
          text
          textPositionX
          textPositionY
          textStyle
          link
          seenByCurrentUser
          likedByCurrentUser
          post {
            id
            postItemsString
            iconLayoutType
            createdDate
            yourMind
            bg
            aspectRatio
            poster {
              id
              username
              displayName
              imageAddress
            }
          }
        }
        totalCount
      }
    }
  }
`;

export const useGetStoriesByUserId = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [data, setData] = useState<Story[]>([]);

  const getData = async (userId: number) => {
    try {
      setIsFetched(false);
      setIsLoading(true);
      const response = await fetch(config.apiUrl + '/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          query: GET_STORIES_QUERY,
          variables: {
            userId
          },
        }),
      });

      if (!response.ok) {
        enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
      };

      const json = await response.json();
      setData(json?.data?.story_getStories?.result?.items || []);
    } catch (err) {
      enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
      throw err;
    } finally {
      setIsFetched(true);
      setIsLoading(false);
    };
  };

  return {
    isLoading,
    isFetched,
    data,
    setData,
    getData,
  };
};
