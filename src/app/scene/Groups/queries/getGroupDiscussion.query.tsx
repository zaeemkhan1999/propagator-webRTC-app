import { useInfiniteQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { DiscussionsDtoFilterInput, DiscussionsDtoSortInput } from '../../../../types/general';
import { PostType } from '../../../../constants/storage/constant';
import { graphqlFetcher } from '@/http/graphql.fetcher';

const MESSAGE_GET_DISCUSSIONS_QUERY = gql`
  query message_getDiscussions(
    $skip: Int,
    $take: Int,
    $where: DiscussionsDtoFilterInput,
    $order: [DiscussionsDtoSortInput!]
  ) {
    message_getDiscussions {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        items {
          id
          commentCount
          isLiked
          isNotInterested
          isSaved
          isViewed
          isYours
          likeCount
          shareCount
          viewCount
          article {
            title
            subTitle
            author
            isVerifield
            isPromote
            id
            isPin
            createdDate
            articleItemsString
            deletedBy
            user {
              id
              imageAddress
              displayName
              username
              isVerified
            }
          }
          post {
            postItemsString
            allowDownload
            isPromote
            isPin
            id
            bg
            aspectRatio
            location
            postType
            postedAt
            yourMind
            createdDate
            iconLayoutType
            poster {
              imageAddress
              username
              legalName
              displayName
              location
              id
              isVerified
            }
          }
        }
        totalCount
      }
      status
    }
  }
`;

interface User {
  id: number;
  imageAddress?: string | null;
  displayName?: string | null;
  username?: string | null;
  isVerified: boolean;
}

interface Article {
  deletedBy: string;
  title: string;
  subTitle: string;
  author: string;
  isVerified: boolean;
  isPromote: boolean;
  id: number;
  isPin: boolean;
  createdDate: string;
  articleItemsString: any;
  user: User;
}

interface Poster {
  id: number;
  imageAddress?: string | null;
  username?: string | null;
  legalName?: string | null;
  displayName?: string | null;
  location?: string | null;
  isVerified: boolean;
}

interface Post {
  postItemsString?: string | null;
  allowDownload: boolean;
  isPromote: boolean;
  isPin: boolean;
  id: number;
  bg?: string;
  aspectRatio?: string;
  location?: string | null;
  postType: PostType;
  postedAt: any;
  yourMind?: string | null;
  createdDate: any;
  poster?: Poster | null;
  iconLayoutType: string;
}

export interface DiscussionItem {
  id: number;
  commentCount: number;
  isLiked: boolean;
  isNotInterested: boolean;
  bg?: string;
  aspectRatio?: string;
  isSaved: boolean;
  isViewed: boolean;
  isYours: boolean;
  likeCount: number;
  shareCount: number;
  viewCount: number;
  post?: Post | null;
  article?: Article | null;
}

interface DiscussionsResult {
  totalCount: number;
  items: DiscussionItem[] | [];
}

export interface Message_GetDiscussionsQuery {
  message_getDiscussions?: {
    status?: {
      code: number;
      value: string;
    };
    result?: DiscussionsResult | null;
  } | null;
}

export const useGetDiscussions = ({
  skip = 0,
  take = 10,
  where,
  order
}: {
  skip?: number;
  take?: number;
  where?: DiscussionsDtoFilterInput;
  order?: DiscussionsDtoSortInput;
}) => {
  return useInfiniteQuery<Message_GetDiscussionsQuery, Error>({
    queryKey: ['message_getDiscussions', skip, take, where, order],
    queryFn: ({ pageParam = 0 }) =>
      graphqlFetcher(MESSAGE_GET_DISCUSSIONS_QUERY, {
        skip: pageParam,
        take,
        where,
        order
      }),
    getNextPageParam: (lastPage, pages) => {
      const totalDiscussions = lastPage?.message_getDiscussions?.result?.totalCount || 0;
      const currentCount = pages.length * take;
      return currentCount < totalDiscussions ? currentCount : undefined;
    },
    initialPageParam: 0,
    enabled: false
  });
};
