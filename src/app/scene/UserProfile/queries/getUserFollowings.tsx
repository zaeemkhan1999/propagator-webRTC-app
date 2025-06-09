import { useState } from 'react';
import config from '@/config/index.dev';
import { getToken } from '@/http/graphql.client';
import { enqueueSnackbar } from 'notistack';

const PER_PAGE_COUNT = 15;

interface UserFollowing {
  followed: {
    id: number;
    username: string;
    displayName: string;
    imageAddress: string;
  };
};

const GET_FOLLOWINGS = `
query follow_getFollowings ($skip: Int, $take: Int, $order: [UserFollowerSortInput!], $userId: Int!) {
  follow_getFollowings(userId: $userId){
   result(skip: $skip, take: $take, order: $order) {
      totalCount
      items{
        followed{
          id
          username
          imageAddress
          displayName
        }
      }
      pageInfo{
        hasNextPage
      }
    }
    status
  }
}
`;

const useGetUserFollowings = (userId?: number) => {
  const [data, setData] = useState<UserFollowing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [skip, setSkip] = useState(0);

  const fetchUsers = async (newSkip: number) => {
    if (!userId) return;

    try {
      const response = await fetch(config.apiUrl + '/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          query: GET_FOLLOWINGS,
          variables: {
            skip: newSkip,
            take: PER_PAGE_COUNT,
            userId,
            order: [{
              createdDate: "DESC"
            }],
          },
        }),
      });

      if (!response.ok) {
        enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
      };

      const result = await response.json();
      const data = result?.data?.follow_getFollowings;

      return data?.result || {};
    } catch (err) {
      enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
      throw err;
    };
  };

  const getInitialData = async (s = skip) => {
    setIsLoading(true);
    try {
      const { items = [], pageInfo } = await fetchUsers(s);

      setData(items);
      setHasNextPage(pageInfo?.hasNextPage || false);
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
      const { items = [], pageInfo } = await fetchUsers(newSkip);

      setData(items);
      setHasNextPage(pageInfo?.hasNextPage || false);
    } catch (err) {
      enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
    } finally {
      setIsFetching(false);
    };
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

export default useGetUserFollowings;
