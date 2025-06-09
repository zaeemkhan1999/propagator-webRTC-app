import {
  InfiniteData,
  keepPreviousData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { fetcher } from "../../../../graphql/fetcher";

// GraphQL query document
export const Post_GetArticlesDocument = `
  query article_getArticles($skip: Int, $take: Int, $where: ArticleDtoFilterInput, $order: [ArticleDtoSortInput!]) {
    article_getArticles {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        items {
          articleItemsString
          isLiked
          isNotInterested
          isSaved
          isYourArticle
          isViewed
          commentCount
          shareCount
          viewCount
          likeCount
          article {
            createdDate
            deletedBy
            title
            subTitle
            author
            isPromote
            id
            isPin
            user {
              id
              imageAddress
              username
            }
          }
        }
        totalCount
      }
      status
    }
  }
`;

export interface Article {
  deletedBy: string;
  title: string;
  subTitle: string;
  author: string;
  isVerified: boolean;
  isPromote: boolean;
  id: number;
  isPin: boolean;
  createdDate: any;
  user: {
    id: number;
    imageAddress: string;
    username: string;
    displayName: string;
    isVerified: boolean;
  };
}

export interface ArticleItem {
  articleItemsString: any;
  isLiked: boolean;
  isNotInterested: boolean;
  isSaved: boolean;
  isYourArticle: boolean;
  isViewed: boolean;
  createdDate: any;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  likeCount: number;
  article: Article;
}

interface Article_GetArticlesResult {
  items: ArticleItem[];
  totalCount: number;
}

export interface Article_GetArticlesQueryResponse {
  article_getArticles: {
    result: Article_GetArticlesResult;
    status: {
      code: number;
      value: string;
    };
  };
}

export interface Article_GetArticlesQueryVariables {
  skip?: number;
  take: number;
  getArticleType?: string;
  where?: {
    isYourArticle?: { eq: boolean },
    article?: {
      isByAdmin?: { eq: boolean; };
      isCreatedInGroup?: { eq: boolean; };
      id?: { eq: number; };
    };
    or?: [
      { article: { title: { contains: string; } } },
      { article: { subTitle: { contains: string; } } },
      { article: { author: { contains: string; } } },
    ]
  };
  order?: {
    field: string;
    direction: string;
  }[];
}

export const usePost_GetArticlesQuery = (
  variables: Article_GetArticlesQueryVariables,
  options?: Partial<
    UseInfiniteQueryOptions<
      Article_GetArticlesQueryResponse,
      Error,
      InfiniteData<Article_GetArticlesQueryResponse>
    >
  >,
) =>
  useInfiniteQuery<
    Article_GetArticlesQueryResponse,
    Error,
    InfiniteData<Article_GetArticlesQueryResponse>
  >({
    queryKey: ["article_getArticles", variables],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetcher<
        Article_GetArticlesQueryResponse,
        Article_GetArticlesQueryVariables
      >(Post_GetArticlesDocument, {
        ...variables,
        skip: pageParam as number,
      })(),
    getNextPageParam: (lastPage, pages) => {
      const totalCount = lastPage.article_getArticles.result.totalCount;
      const totalFetchedCount = pages.reduce(
        (sum, page) => sum + page.article_getArticles.result.items.length,
        0,
      );
      if (totalCount > totalFetchedCount) return totalFetchedCount;
      return undefined;
    },
    placeholderData: keepPreviousData,
    ...options,
    enabled: false
  });
