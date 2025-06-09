import { useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";
import { fetcher } from "@/graphql/fetcher";
import { ExplorePostsResponse, Result, Post_GetExplorePostsQueryVariables } from "./getExplorePosts";

export const Post_GetExploreVideoPostsDocument = `
  query post_getExploreVideoPosts($lastId: Int, $pageSize: Int!, $searchTerm: String, $skip: Int!, $take: Int!) {
    post_getExploreVideoPosts(lastId: $lastId,
        pageSize: $pageSize,
        searchTerm: $searchTerm,
        skip: $skip,
        take: $take) {
      result {
        postItemsString
        post {
          id
        }
      }
      totalCount
      status
    }
  }
`;

interface Post_GetExplorePostsQueryResponse {
  post_getExploreVideoPosts: ExplorePostsResponse;
}

export const useGetExploreVideoPosts = (
  variables: Post_GetExplorePostsQueryVariables,
  options?: UseInfiniteQueryOptions<
    Post_GetExplorePostsQueryResponse,
    Error,
    Result[]
  >
) =>
  useInfiniteQuery<Post_GetExplorePostsQueryResponse, Error, Result[]>({
    queryKey: ["post_getExploreVideoPosts", variables],
    queryFn: ({ pageParam = 0 }) =>
      fetcher<Post_GetExplorePostsQueryResponse, Post_GetExplorePostsQueryVariables>(
        Post_GetExploreVideoPostsDocument,
        {
          skip: pageParam as number,
          take: variables.take,
          searchTerm: variables.searchTerm,
          pageSize: variables.take
        }
      )(),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((page) => page.post_getExploreVideoPosts.result).length;
      const totalAvailable = lastPage.post_getExploreVideoPosts.totalCount;
      return totalFetched < totalAvailable ? totalFetched : undefined;
    },
    select: (data) =>
      data.pages.flatMap((page) => page.post_getExploreVideoPosts.result),
    initialPageParam: 0,
    enabled: false,
    ...options,
  });