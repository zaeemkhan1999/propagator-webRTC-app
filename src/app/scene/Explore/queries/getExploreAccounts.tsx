import {
  keepPreviousData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { fetcher } from "../../../../graphql/fetcher";

// GraphQL query for fetching user search accounts
export const UserSearchAccountDocument = `
  query userSearchAccount_getUserSearchAccounts(
    $skip: Int,
    $take: Int,
    $where: UserSearchAccountFilterInput,
    $order: [UserSearchAccountSortInput!]
  ) {
    userSearchAccount_getUserSearchAccounts {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        items {
          id
          searched {
            username
            legalName
            displayName
            imageAddress
            id
          }
        }
        totalCount
      }
      status
    }
  }
`;

// TypeScript interfaces for response and query variables
export interface SearchedAccount {
  username: string;
  legalName: string | null;
  displayName: string;
  imageAddress: string;
  id: number;
}

export interface UserSearchAccountItem {
  id: number;
  searched: SearchedAccount;
}

interface UserSearchAccountResult {
  items: UserSearchAccountItem[];
  totalCount: number;
}

interface UserSearchAccountQueryResponse {
  userSearchAccount_getUserSearchAccounts: {
    result: UserSearchAccountResult;
    status: {
      code: number;
      value: string;
    };
  };
}

interface UserSearchAccountQueryVariables {
  skip?: number | any;
  take: number;
  where?: {
    id?: {
      neq?: number;
    };
  };
  order?: [{
    createdDate: string;
  }]
}

// Custom hook to fetch user search accounts
export const usePost_SearchAccountQuery = (
  variables: UserSearchAccountQueryVariables,
  options?: Partial<
    UseInfiniteQueryOptions<
      UserSearchAccountQueryResponse,
      Error,
      UserSearchAccountItem[]
    >
  >
) =>
  useInfiniteQuery<
    UserSearchAccountQueryResponse,
    Error,
    UserSearchAccountItem[]
  >({
    queryKey: ["userSearchAccount_getUserSearchAccounts", variables],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) => {
      // We ensure that skip is being set correctly for pagination
      return fetcher<UserSearchAccountQueryResponse, UserSearchAccountQueryVariables>(
        UserSearchAccountDocument,
        { ...variables, skip: pageParam }
      )();
    },
    getNextPageParam: (lastPage, pages) => {
      const totalCount =
        lastPage?.userSearchAccount_getUserSearchAccounts?.result?.totalCount;
      const totalFetchedCount = pages.reduce(
        (sum, page) =>
          sum +
          page.userSearchAccount_getUserSearchAccounts.result.items.length,
        0
      );
      if (totalFetchedCount < totalCount) return totalFetchedCount;
      return undefined;
    },
    select: (data) =>
      data?.pages
        .map(
          (page) => page.userSearchAccount_getUserSearchAccounts?.result.items
        )
        .flat(1),
    placeholderData: keepPreviousData,
    ...options,
  });
