import { useState } from 'react';
import { gql } from 'graphql-request';
import config from '@/config/index.dev';
import { getToken } from '@/http/graphql.client';
import { enqueueSnackbar } from 'notistack';
import { PER_PAGE_COUNT } from './getPostsInAdvanceWay';

const POST_GET_FOLLOWERS_POSTS_QUERY = gql`
  query post_getFollowersPosts($skip: Int, $take: Int) {
    post_getFollowersPosts {
      result(skip: $skip, take: $take) {
        items {
          postItemsString
          isLiked
          isNotInterested
          isSaved
          isYourPost
          isViewed
          commentCount
          shareCount
          viewCount
          likeCount
          post {
            id
            deletedBy
            isPromote
            postItemsString
            location
            postType
            iconLayoutType
            allowDownload
            isPin
            aspectRatio
            bg
            poster {
              id
              username
              legalName
              displayName
              imageAddress
              isVerified
            }
            isCreatedInGroup
            createdDate
            yourMind
          }
        }
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
      status
    }
  }
`;

const useGetFollowersPosts = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [skip, setSkip] = useState(0);

  const fetchPosts = async (newSkip: number) => {
    try {
      const response = await fetch(config.apiUrl + '/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          query: POST_GET_FOLLOWERS_POSTS_QUERY,
          variables: {
            skip: newSkip,
            take: PER_PAGE_COUNT,
          },
        }),
      });

      if (!response.ok) {
        enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
      };

      const result = await response.json();
      const data = result?.data?.post_getFollowersPosts;

      return data?.result || {};
    } catch (err) {
      enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
      throw err;
    }
  };

  const getInitialData = async (s = skip) => {
    setIsLoading(true);
    try {
      const { items = [], pageInfo } = await fetchPosts(s);

      setData(items);
      setHasNextPage(pageInfo?.hasNextPage || false);
    } catch (err) {
      enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNextPage = async () => {
    if (!hasNextPage || isFetching) return;

    setIsFetching(true);
    const newSkip = skip + PER_PAGE_COUNT;
    setSkip(newSkip);

    try {
      const { items = [], pageInfo } = await fetchPosts(newSkip);

      setData(items);
      setHasNextPage(pageInfo?.hasNextPage || false);
    } catch (err) {
      enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
    } finally {
      setIsFetching(false);
    }
  };

  return {
    data,
    isLoading,
    getData: getInitialData,
    isFetching,
    hasNextPage,
    fetchNextPage,
  };
};

export default useGetFollowersPosts;
