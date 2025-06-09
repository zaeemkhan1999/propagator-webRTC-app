import { useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";
import { fetcher } from "@/graphql/fetcher";
import { ExplorePostsResponse, Result, Post_GetExplorePostsQueryVariables } from "./getExplorePosts";

export const Post_GetExploreImagePostsDocument = `
  query post_getExploreImagePosts($lastId: Int, $pageSize: Int!, $searchTerm: String, $skip: Int!, $take: Int!) {
    post_getExploreImagePosts(lastId: $lastId,
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
  post_getExploreImagePosts: ExplorePostsResponse;
}

export const useGetExploreImagePosts = (
  variables: Post_GetExplorePostsQueryVariables,
  options?: UseInfiniteQueryOptions<
    Post_GetExplorePostsQueryResponse,
    Error,
    Result[]
  >
) =>
  useInfiniteQuery<Post_GetExplorePostsQueryResponse, Error, Result[]>({
    queryKey: ["post_getExploreImagePosts", variables],
    queryFn: ({ pageParam = 0 }) =>
      fetcher<Post_GetExplorePostsQueryResponse, Post_GetExplorePostsQueryVariables>(
        Post_GetExploreImagePostsDocument,
        {
          skip: pageParam as number,
          take: variables.take,
          searchTerm: variables.searchTerm,
          pageSize: variables.take
        }
      )(),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((page) => page.post_getExploreImagePosts.result).length;
      const totalAvailable = lastPage.post_getExploreImagePosts.totalCount;
      return totalFetched < totalAvailable ? totalFetched : undefined;
    },
    select: (data) =>
      data.pages.flatMap((page) => page.post_getExploreImagePosts.result),
    initialPageParam: 0,
    enabled: false,
    ...options,
  });