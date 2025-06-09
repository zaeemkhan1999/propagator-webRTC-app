import { useState } from "react";
import { fetcher } from "../../../../../../graphql/fetcher";
import {
  CommentType,
  DeletedBy,
} from "../../../../../../constants/storage/constant";

// GraphQL query for getting article comments
const ARTICLE_COMMENT_GET_ARTICLE_COMMENTS_DOCUMENT = `
  query articleComment_getArticleComments($skip: Int, $take: Int, $where: ArticleCommentDtoFilterInput, $order: [ArticleCommentDtoSortInput!], $loadDeleted: Boolean!) {
    articleComment_getArticleComments(loadDeleted: $loadDeleted) {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        items {
          likeCount
          isLiked
          articleComment {
            mention {
              username
            }
            mentionId
            deletedBy
            user {
              username
              id
              imageAddress
              legalName
              displayName
            }
            articleId
            children {
              id
            }
            commentType
            article {
              articleItemsString
              id
            }
            parentId
            id
            text
            contentAddress
            createdDate
            parent {
              text
              contentAddress
              user {
                username
                legalName
                displayName
                imageAddress
              }
              userId
            }
          }
        }
        totalCount
      }
      status
    }
  }
`;

type ArticleComment_GetArticleCommentsQuery = {
  __typename?: "Query";
  articleComment_getArticleComments: {
    __typename?: "ListResponseBaseOfArticleCommentDto";
    status: any | null;
    result: {
      __typename?: "ArticleCommentDtoCollectionSegment";
      totalCount: number;
      items: Array<{
        __typename?: "ArticleCommentDto";
        likeCount: number;
        isLiked: boolean;
        articleComment: {
          __typename?: "ArticleComment";
          mentionId?: number | null;
          deletedBy: DeletedBy;
          user: {
            __typename?: "User";
            username?: string | null;
            id: number;
            imageAddress?: string | null;
            legalName?: string | null;
            displayName?: string | null;
          };
          articleId: number;
          children: Array<{
            __typename?: "ArticleComment";
            id: number;
          } | null> | null;
          commentType: CommentType;
          article: {
            __typename?: "Article";
            articleItemsString: string;
            id: number;
          };
          parentId?: number | null;
          id: number;
          text?: string | null;
          contentAddress?: string | null;
          createdDate: string;
          parent?: {
            __typename?: "ArticleComment";
            text?: string | null;
            contentAddress?: string | null;
            user: {
              __typename?: "User";
              username?: string | null;
              legalName?: string | null;
              displayName?: string | null;
              imageAddress?: string | null;
            };
            userId: number;
          } | null;
        };
      }>;
    } | null;
  } | null;
};

// Locally defined types for query variables
type ArticleComment_GetArticleCommentsQueryVariables = {
  skip: number;
  take: number;
  loadDeleted: boolean;
  where: {
    articleComment: {
      articleId: {
        eq: number;
      };
      parentId: {
        eq: null | number;
      };
    };
  };
  order: {
    articleComment: {
      id: string;
    };
  };
};

// TODO: use react-query
// Custom hook for fetching article comments with infinite scrolling
export const useGetScrollComments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] =
    useState<ArticleComment_GetArticleCommentsQuery | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Function to fetch the initial article comments
  const getScrollComments = async (
    variables: ArticleComment_GetArticleCommentsQueryVariables
  ) => {
    setLoading(true);
    setError(null);

    try {
      const fetchComments = fetcher<
        ArticleComment_GetArticleCommentsQuery,
        ArticleComment_GetArticleCommentsQueryVariables
      >(ARTICLE_COMMENT_GET_ARTICLE_COMMENTS_DOCUMENT, variables);
      const result = await fetchComments();

      setData(result);
      if (result?.articleComment_getArticleComments?.result?.items) {
        setHasNextPage(
          result?.articleComment_getArticleComments?.result?.items.length > 0 ||
            false
        );
      }
      setCurrentPage(1);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getNextPage = async (
    variables: ArticleComment_GetArticleCommentsQueryVariables
  ) => {
    if (!hasNextPage || loading) return;

    setLoading(true);
    setError(null);

    try {
      const fetchComments = fetcher<
        ArticleComment_GetArticleCommentsQuery,
        ArticleComment_GetArticleCommentsQueryVariables
      >(ARTICLE_COMMENT_GET_ARTICLE_COMMENTS_DOCUMENT, {
        ...variables,
        skip: currentPage * variables.take!,
      });
      const result = await fetchComments();

      if (
        result?.articleComment_getArticleComments?.result?.items &&
        result.articleComment_getArticleComments.result.items.length > 0
      ) {
        setData((prevData: any) => ({
          ...prevData,
          articleComment_getArticleComments: {
            ...prevData?.articleComment_getArticleComments,
            result: {
              ...prevData?.articleComment_getArticleComments.result,
              items: [
                ...(prevData?.articleComment_getArticleComments.result.items ||
                  []),
                ...(result?.articleComment_getArticleComments?.result?.items ||
                  []),
              ],
            },
          },
        }));
        setCurrentPage((prevPage) => prevPage + 1);
      } else {
        setHasNextPage(false);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = (
    variables: ArticleComment_GetArticleCommentsQueryVariables
  ) => {
    getScrollComments(variables);
  };

  return {
    getScrollComments,
    getNextPage,
    loading,
    error,
    data,
    hasNextPage,
    refetch,
  };
};
