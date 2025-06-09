import { useState } from 'react';
import { Post_GetPostsInAdvanceWayDocument, Post_GetPostsInAdvanceWaySuggestionDocument } from '../../Explore/queries/getFeedData';
import config from '@/config/index.dev';
import { getToken } from '@/http/graphql.client';
import { enqueueSnackbar } from 'notistack';
import { Exact, InputMaybe, PostDtoSortInput, Scalars } from '@/types/general';
import { GetPostType } from '@/constants/storage/constant';
import useIsSafari from '@/hooks/useIsSafari';

export const isSafariBrowser = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isIOS = /iPhone|iPad|iPod/.test(userAgent);
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);
    const isMac = /Macintosh/.test(userAgent);

    return (isIOS || isMac) && isSafariBrowser;
};

export const PER_PAGE_COUNT = isSafariBrowser() ? 15 : 6;

export type PostDtoFilterInput = {
    post: {
        isCreatedInGroup?: { eq: boolean },
        isByAdmin?: { eq: boolean },
        yourMind?: { contains: string },
        posterId?: { eq: number | null },
        aspectRatio?: { eq: string },
        id?: { eq: number },
    },
};

type Post_GetPostsInAdvanceWayQueryVariables = Exact<{
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    take?: InputMaybe<Scalars["Int"]["input"]>;
    order?: InputMaybe<Array<PostDtoSortInput> | PostDtoSortInput>;
    getPostType: GetPostType;
    where?: PostDtoFilterInput;
}>;

const useGetPostsInAdvancedWay = (variables: Post_GetPostsInAdvanceWayQueryVariables, needPostSuggesstions = false) => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [skip, setSkip] = useState(variables?.skip ?? 0);
    const [total, setTotal] = useState(0);
    var isSafari = useIsSafari();

    const fetchPosts = async (newSkip: number) => {
        data.length && setData([]);
        try {
            const response = await fetch(config.apiUrl + '/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    query: !needPostSuggesstions
                        ? Post_GetPostsInAdvanceWayDocument
                        : Post_GetPostsInAdvanceWaySuggestionDocument,
                    variables: {
                        ...variables,
                        skip: newSkip,
                        take: variables?.take ?? PER_PAGE_COUNT,
                    },
                }),
            });

            if (!response.ok) {
                enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
            };

            const result = await response.json();
            const data = result?.data?.post_getPostsInAdvanceWay;

            data?.result?.totalCount !== total && setTotal(data?.result?.totalCount || 0);
            return data?.result || {};
        } catch (err) {
            enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
            throw err;
        };
    };

    const getInitialData = async (s = skip) => {
        setIsLoading(true);
        try {
            const { items = [], pageInfo } = await fetchPosts(s);
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
            const { items = [], pageInfo } = await fetchPosts(newSkip);

            setData(items);
            setHasNextPage(pageInfo?.hasNextPage || false);
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
        setData,
        isLoading,
        getData: getInitialData,
        isFetching,
        hasNextPage,
        fetchNextPage,
        fetchSpecificPage,
        total,
        skip,
    };
};

export default useGetPostsInAdvancedWay;


