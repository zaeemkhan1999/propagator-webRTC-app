import { useInfiniteQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphqlFetcher } from '@/http/graphql.fetcher';

const USER_GET_USERS_QUERY = gql`
  query groupRequest_PendingGroupRequests(
    $groupId: Int!,
    $skip: Int,
    $take: Int,
    $where: GroupRequestDtoFilterInput,
    $order: [GroupRequestDtoSortInput!]
  ) {
    groupRequest_PendingGroupRequests(groupId: $groupId) {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        items {
            id
            groupAdminId
            status
            user {
              id
              username
              displayName
              imageAddress
                }
            }
        totalCount
        pageInfo {
          hasNextPage
        }
      }
      status
    }
  }
`;

interface Response {
    groupRequest_PendingGroupRequests: {
        result: Result;
        status: {
            code: number;
            value: string;
        };
    };
};

interface Result {
    items: Item[];
    totalCount: number;
    pageInfo: {
        hasNextPage: boolean;
    };
};

interface Item {
    id: number;
    groupAdminId: number;
    status: string;
    user: {
        id: number
        username: string;
        displayName: string;
        imageAddress: string;
    };
};

const useGetGroupRequests = (groupId: number) => {
    return useInfiniteQuery<Response, Error, Item[]>({
        queryKey: ['groupRequest_PendingGroupRequests', groupId],
        queryFn: ({ pageParam = 0 }) =>
            graphqlFetcher(USER_GET_USERS_QUERY, {
                skip: pageParam,
                take: 15,
                order: [{ id: 'DESC' }],
                groupId,
            }),
        getNextPageParam: (lastPage, pages) => {
            return lastPage?.groupRequest_PendingGroupRequests?.result?.pageInfo?.hasNextPage ? pages.length * 15 : undefined;
        },
        select: (data) => data?.pages?.flatMap(page => page?.groupRequest_PendingGroupRequests?.result?.items),
        initialPageParam: 0,
        enabled: false
    });
};

export default useGetGroupRequests;
