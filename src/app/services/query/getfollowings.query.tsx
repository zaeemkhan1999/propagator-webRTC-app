import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { fetcher } from "../../../graphql/fetcher";
import {
  Follow_GetFollowingsQuery,
  Follow_GetFollowingsQueryVariables,
} from "../../../types/general";

const Follow_GetFollowingsDocument = `
    query follow_getFollowings($skip: Int, $take: Int, $where: UserFollowerFilterInput, $order: [UserFollowerSortInput!]) {
  follow_getFollowings {
    result(skip: $skip, take: $take, where: $where, order: $order) {
      items {
        followedId
        followerId
        followeAcceptStatus
        followed {
          legalName
          displayName
          imageAddress
          id
          username
        }
        follower {
          username
          imageAddress
          id
          legalName
          displayName
        }
      }
      totalCount
    }
    status
  }
}
    `;

export const useInfiniteFollow_GetFollowingsQuery = (
  variables?: Follow_GetFollowingsQueryVariables,
  options?: UseInfiniteQueryOptions<Follow_GetFollowingsQuery>
) => {
  return useInfiniteQuery({
    queryKey:
      variables === undefined
        ? ["follow_getFollowings.infinite"]
        : ["follow_getFollowings.infinite", variables],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetcher<Follow_GetFollowingsQuery, Follow_GetFollowingsQueryVariables>(
        Follow_GetFollowingsDocument,
        { ...variables, skip: pageParam as number }
      )(),
    getNextPageParam: (lastPage, pages) => {
      const totalCount =
        lastPage?.follow_getFollowings?.result?.totalCount ?? 0;
      const totalFetchedCount = pages.reduce(
        (sum, page) =>
          sum + (page.follow_getFollowings?.result?.items?.length ?? 0),
        0
      );
      if (totalCount > totalFetchedCount) return totalFetchedCount;
      return undefined;
    },
    ...options,
  });
};
