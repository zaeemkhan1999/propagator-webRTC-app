import { useState } from 'react';
import config from '@/config/index.dev';
import { getToken } from '@/http/graphql.client';
import { enqueueSnackbar } from 'notistack';

const PER_PAGE_COUNT = 15;

const GET_POST_LIKES = `
query post_getLikedPostsUsers(
    $postId: Int!
    $skip: Int
    $take: Int
){
  post_getLikedPostsUsers(postId: $postId){
    result(skip: $skip, take: $take){
      items{
        id
        user{
          id
          username
          imageAddress
        }
      }
      pageInfo{
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
    status
  }
}
`

const useGetPostLikes = () => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [pId, setPId] = useState<null | number>(null);
    const [skip, setSkip] = useState(0);

    const fetchLikes = async (newSkip: number, postId: number) => {
        try {
            const response = await fetch(config.apiUrl + '/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    query: GET_POST_LIKES,
                    variables: {
                        postId,
                        skip: newSkip,
                        take: PER_PAGE_COUNT,
                    },
                }),
            });

            if (!response.ok) {
                enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
            };

            const result = await response.json();
            const data = result?.data?.post_getLikedPostsUsers;

            return data?.result || {};
        } catch (err) {
            enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
            throw err;
        };
    };

    const getInitialData = async (postId: number) => {
        setPId(postId);
        setIsLoading(true);
        try {
            const { items = [], pageInfo } = await fetchLikes(skip, postId);

            setData(items);
            setHasNextPage(pageInfo?.hasNextPage || false);
        } catch (err) {
            enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
        } finally {
            setIsLoading(false);
        };
    };

    const fetchNextPage = async () => {
        if (!hasNextPage || isFetching || !pId) return;

        setIsFetching(true);
        const newSkip = skip + PER_PAGE_COUNT;
        setSkip(newSkip);

        try {
            const { items = [], pageInfo } = await fetchLikes(newSkip, pId);

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

export default useGetPostLikes;
