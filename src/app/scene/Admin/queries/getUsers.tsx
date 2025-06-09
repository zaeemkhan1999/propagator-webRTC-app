import { useInfiniteQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphqlFetcher } from '@/http/graphql.fetcher';

interface Blocker {
  id: string;
  username: string;
};

export interface AdminUser {
  id: string;
  legalName: string;
  displayName: string;
  username: string;
  imageAddress: string;
  privateAccount: boolean;
  lastSeen: string;
  email: string;
  isSuspended: boolean;
  isActive: boolean;
  blockers: {
    blocker: Blocker;
  }[];
};

interface UserResult {
  items: AdminUser[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
  };
};

interface UserGetResponse {
  user_getUsers: {
    result: UserResult;
    status: string;
  };
};

const USER_GET_USERS_QUERY = gql`
  query user_getUsers(
    $skip: Int,
    $take: Int,
    $where: UserFilterInput,
    $order: [UserSortInput!]
  ) {
    user_getUsers {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        items {
          id
          legalName
          displayName
          username
          imageAddress
          privateAccount
          lastSeen
          email
          isSuspended
          isActive
          blockers {
            blocker {
              id
              username
            }
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

type userTypes = ("USER" | "ADMIN" | "SUPER_ADMIN")[];

export const useGetUsers = ({ searchTerm, excludeUserIds = [], ofTypes, isActive = true }: { searchTerm: string, excludeUserIds?: (number | null | undefined)[], ofTypes?: userTypes, isActive?: boolean }) => {
  return useInfiniteQuery<UserGetResponse, Error>({
    queryKey: ['user_getUsers', searchTerm, excludeUserIds, ofTypes],
    queryFn: ({ pageParam = 0 }) =>
      graphqlFetcher(USER_GET_USERS_QUERY, {
        skip: pageParam,
        take: 15,
        where: {
          ...(searchTerm && {
            or: [
              { username: { contains: searchTerm } },
              { displayName: { contains: searchTerm } }
            ]
          }),
          userTypes: {
            in: ofTypes,
          },
          id: {
            nin: excludeUserIds,
          },
          isDeleted: {
            eq: false,
          },
          isActive: {
            eq: isActive,
          },
        },
        order: [{ displayName: 'ASC' }],
      }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.user_getUsers?.result?.pageInfo?.hasNextPage ? pages.length * 15 : undefined;
    },
    initialPageParam: 0,
    enabled: false
  });
};
