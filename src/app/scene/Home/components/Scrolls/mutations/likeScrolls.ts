import { useState } from "react";
import { Exact } from "../../../../../../types/general";
import { fetcher } from "../../../../../../graphql/fetcher";

// GraphQL mutation
const Article_LikeArticleDocument = `
  mutation article_likeArticle($articleId: Int!, $liked: Boolean!) {
    article_likeArticle(articleId: $articleId, liked: $liked) {
      status
    }
  }
`;

// Type definitions for mutation response and variables
type Article_LikeArticleMutation = {
  __typename?: "Mutation";
  article_likeArticle?: {
    __typename?: "ResponseBaseOfArticleLike";
    status?: { __typename?: "Status"; code: number; value: string } | null;
  } | null;
};

type Article_LikeArticleMutationVariables = Exact<{
  articleId: number;
  liked: boolean;
}>;

// TODO: use react-query
// Custom hook for liking an article
export const useLikeScroll = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<{ code: number; value: string } | null>(
    null
  );

  const likeScroll = async (
    variables: Article_LikeArticleMutationVariables,
    onSuccess?: Function
  ) => {
    setLoading(true);
    setError(null);

    try {
      const likeArticleFetcher = fetcher<
        Article_LikeArticleMutation,
        Article_LikeArticleMutationVariables
      >(Article_LikeArticleDocument, variables);
      const result = await likeArticleFetcher();
      setStatus(result?.article_likeArticle?.status || null);
      onSuccess?.();
    } catch (err) {
      setError(err as Error); // Handle errors
    } finally {
      setLoading(false);
    }
  };

  return { likeScroll, loading, error, status };
};
