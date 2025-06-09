import { useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";
import { fetcher } from "@/graphql/fetcher";

export const Post_GetExplorePostsDocument = `
  query post_getExplorePosts($lastId: Int, $pageSize: Int!, $searchTerm: String, $skip: Int!, $take: Int!) {
    post_getExplorePosts(lastId: $lastId,
        pageSize: $pageSize,
        searchTerm: $searchTerm,
        skip: $skip,
        take: $take) {
      result {
        postItemsString
        post {
          id
          yourMind
        }
      }
      totalCount
      status
    }
  }
`;

export interface Result {
  id: number;
  postItemsString: string;
  post: {
    id: number;
    yourMind: string;
  };
}

export interface ExplorePostsResponse {
  result: Result[];
  totalCount: number;
  status: {
    code: number;
    value: string;
  };
};

interface Post_GetExplorePostsQueryResponse {
  post_getExplorePosts: ExplorePostsResponse;
}

export interface Post_GetExplorePostsQueryVariables {
  skip?: number;
  take: number;
  searchTerm?: string;
  pageSize?: number;
}

export interface Post_GetExplorePostsResultPostItemsString {
  Order: number;
  ThumNail: string;
  Content: string;
  SummaryVideoLink: any;
  VideoShape: any;
  VideoTime: any;
  PostItemType: number;
  Width: number;
  Height: number;
}

export const usePost_GetExplorePostsQuery = (
  variables: Post_GetExplorePostsQueryVariables,
  options?: UseInfiniteQueryOptions<
    Post_GetExplorePostsQueryResponse,
    Error,
    Result[]
  >
) =>
  useInfiniteQuery<Post_GetExplorePostsQueryResponse, Error, Result[]>({
    queryKey: ["post_getExplorePosts", variables],
    queryFn: ({ pageParam = 0 }) =>
      fetcher<Post_GetExplorePostsQueryResponse, Post_GetExplorePostsQueryVariables>(
        Post_GetExplorePostsDocument,
        {
          skip: pageParam as number,
          take: variables.take,
          searchTerm: variables.searchTerm,
          pageSize: variables.take
        }
      )(),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((page) => page.post_getExplorePosts.result).length;
      const totalAvailable = lastPage.post_getExplorePosts.totalCount;
      return totalFetched < totalAvailable ? totalFetched : undefined;
    },
    select: (data) =>
      data.pages.flatMap((page) => page.post_getExplorePosts.result),
    initialPageParam: 0,
    enabled: false,
    ...options,
  });