import {
  keepPreviousData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { fetcher } from "../../../../graphql/fetcher";
import { PostItemString } from "../../../../types/Feed";

// GraphQL query document
export const Post_GetPostsDocument = `
  query post_getPosts($skip: Int, $take: Int, $where: PostDtoFilterInput, $order: [PostDtoSortInput!]) {
    post_getPosts {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        items {
          postItemsString
          isLiked
          isNotInterested
          isSaved
          isYourPost
          isViewed
          commentCount
          shareCount
          viewCount
          likeCount
          post {
            savePostsCount
            deletedBy
            isPin
            isPromote
            id
            location
            postType
            postedAt
            yourMind
            allowDownload
            createdDate
            poster {
              imageAddress
              username
              id
              isVerified
            }
            warningBanners {
              description
              id
              postId
            }
          }
        }
        totalCount
      }
      status
    }
  }
`;

// TypeScript interfaces for response and variables
interface Post {
  savePostsCount: number;
  deletedBy: string;
  isPin: boolean;
  isPromote: boolean;
  id: number;
  location: string | null;
  postType: string;
  postedAt: string;
  yourMind: string;
  allowDownload: boolean;
  createdDate: string;
  poster: {
    imageAddress: string;
    username: string;
    id: number;
    isVerified: boolean;
  };
  warningBanners: {
    description: string;
    id: number;
    postId: number;
  }[];
}

interface PostItem {
  postItemsString: PostItemString;
  isLiked: boolean;
  isNotInterested: boolean;
  isSaved: boolean;
  isYourPost: boolean;
  isViewed: boolean;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  likeCount: number;
  post: Post;
}

interface Post_GetPostsResult {
  items: PostItem[];
  totalCount: number;
}

interface Post_GetPostsQueryResponse {
  post_getPosts: {
    result: Post_GetPostsResult;
    status: {
      code: number;
      value: string;
    };
  };
}

interface Post_GetPostsQueryVariables {
  skip?: number;
  take: number;
  where?: {
    post?: {
      postItemsString?: {
        eq: string;
      };
      isCreatedInGroup?: {
        eq: boolean;
      };
      yourMind?: {
        contains: string;
      };
    };
  };
  order?: {
    field: string;
    direction: string;
    createdDate: string;
  }[];
}

export const usePost_GetPostsQuery = (
  variables: Post_GetPostsQueryVariables,
  options?: Partial<
    UseInfiniteQueryOptions<Post_GetPostsQueryResponse, Error, PostItem[]>
  >
) =>
  useInfiniteQuery<Post_GetPostsQueryResponse, Error, PostItem[]>({
    queryKey: ["post_getPosts", variables],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetcher<Post_GetPostsQueryResponse, Post_GetPostsQueryVariables>(
        Post_GetPostsDocument,
        { ...variables, skip: pageParam as number }
      )(),
    getNextPageParam: (lastPage, pages) => {
      const totalCount = lastPage?.post_getPosts?.result?.totalCount;
      const totalFetchedCount = pages.reduce(
        (sum, page) => sum + page.post_getPosts.result.items.length,
        0
      );
      if (totalCount > totalFetchedCount) return totalFetchedCount;
      return undefined;
    },

    select: (data) =>
      data?.pages.map((page) => page.post_getPosts.result.items).flat(1),
    placeholderData: keepPreviousData,
    ...options,
    enabled: false,
  });
