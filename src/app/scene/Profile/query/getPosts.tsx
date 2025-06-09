import { PostDtoSortInput } from "../../../../types/general";
import { PostDtoFilterInput } from "../../Home/queries/getPostsInAdvanceWay";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import config from "@/config/index.dev";
import { getToken } from "@/http/graphql.client";

const Post_GetPostsDocument = `
  query post_getPosts($skip: Int, $take: Int, $where: PostDtoFilterInput, $order: [PostDtoSortInput!]) {
    post_getPosts {
      result(skip: $skip, take: $take, where: $where, order: $order) {
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
            savePostsCount
            deletedBy
            isPin
            bg
            aspectRatio
            isPromote
            id
            location
            iconLayoutType
            postType
            postedAt
            yourMind
            allowDownload
            createdDate
            poster {
              imageAddress
              username
              id
              isVerified
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

type Post_GetPostsQueryVariables = {
  where?: PostDtoFilterInput;
  order?: PostDtoSortInput[];
};

export const PER_PAGE_COUNT = 12;

const useGetPosts = (variables: Post_GetPostsQueryVariables) => {
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
          query: Post_GetPostsDocument,
          variables: {
            ...variables,
            skip: newSkip,
            take: PER_PAGE_COUNT,
          }
        })
      });

      if (!response.ok) {
        enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
      };

      const result = await response.json();
      const data = result?.data?.post_getPosts;

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

export default useGetPosts;
