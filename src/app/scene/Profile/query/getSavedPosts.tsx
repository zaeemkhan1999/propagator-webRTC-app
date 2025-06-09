import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import config from "@/config/index.dev";
import { getToken } from "@/http/graphql.client";
import { PER_PAGE_COUNT } from "./getPosts";

const GET_SAVED_POSTS_QUERY = `
  query post_getSavedPosts($skip: Int, $take: Int) {
    post_getSavedPosts {
      result(skip: $skip, take: $take) {
        items {
          isSaved
          commentCount
          likeCount
          isYourPost
          viewCount
          shareCount
          postId
          isLiked
          post {
            id
            postType
            postItemsString
            iconLayoutType
            posterId
            yourMind
            isCreatedInGroup
            createdDate
            postedAt
            poster {
              id
              username
              displayName
              imageAddress
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        totalCount
      }
      status 
    }
  }
`;

const useGetSavedPosts = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchPosts = async (newSkip: number) => {
    try {
      const response = await fetch(config.apiUrl + '/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          query: GET_SAVED_POSTS_QUERY,
          variables: {
            skip: newSkip,
            take: PER_PAGE_COUNT,
          }
        })
      });

      if (!response.ok) {
        enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
      };

      const result = await response.json();
      const data = result?.data?.post_getSavedPosts;

      return data?.result || {};
    } catch (err) {
      enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
      throw err;
    };
  };

  const getInitialData = async (s = skip) => {
    try {
      setIsLoading(true);
      s !== skip && setSkip(s);

      const { items = [], pageInfo, totalCount } = await fetchPosts(s);

      setData(items);
      setHasNextPage(pageInfo?.hasNextPage || false);
      totalCount !== total && setTotal(totalCount);
    } catch (err) {
      enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
    } finally {
      setIsLoading(false);
    };
  };

  const fetchNextPage = async () => {
    if (!hasNextPage || isFetching) return;

    setIsFetching(true);
    const newSkip = skip + PER_PAGE_COUNT;
    setSkip(newSkip);

    try {
      const { items = [], pageInfo, totalCount } = await fetchPosts(newSkip);

      setData(prev => [...prev, ...items]);
      setHasNextPage(pageInfo?.hasNextPage || false);
      totalCount !== total && setTotal(totalCount);
    } catch (err) {
      enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
    } finally {
      setIsFetching(false);
    };
  };

  const fetchSpecificPage = async (newSkip: number) => {
    if (isLoading) return;

    setIsLoading(true);
    skip !== newSkip && setSkip(newSkip);

    try {
      const { items = [], pageInfo, totalCount } = await fetchPosts(newSkip);

      setData(items);
      setHasNextPage(pageInfo?.hasNextPage || false);
      totalCount !== total && setTotal(totalCount);
    } catch (err) {
      enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
    } finally {
      setIsLoading(false);
    };
  };

  return {
    data,
    isLoading,
    isFetching,
    getData: getInitialData,
    hasNextPage,
    fetchNextPage,
    fetchSpecificPage,
    skip,
    total,
  };
};

export default useGetSavedPosts;
