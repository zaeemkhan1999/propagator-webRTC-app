import { useState } from "react";
import { Exact } from "../../../../../../types/general";
import { fetcher } from "../../../../../../graphql/fetcher";

// GraphQL mutation
const Article_UnLikeArticleDocument = `
  mutation article_unLikeArticle($articleId: Int!) {
    article_unLikeArticle(articleId: $articleId) {
      status
    }
  }
`;

// Type definitions for mutation response and variables
type Article_UnLikeArticleMutation = {
  __typename?: "Mutation";
  article_unLikeArticle?: {
    __typename?: "ResponseBaseOfArticleLike";
    status?: { __typename?: "Status"; code: number; value: string } | null;
  } | null;
};

type Article_UnLikeArticleMutationVariables = Exact<{
  articleId: number;
}>;
// TODO: use react-query
// Custom hook for unliking an article
export const useUnLikeScroll = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<{ code: number; value: string } | null>(
    null
  );

  const unLikeScroll = async (
    variables: Article_UnLikeArticleMutationVariables,
    onSuccess?: Function
  ) => {
    setLoading(true);
    setError(null);

    try {
      const unLikeArticleFetcher = fetcher<
        Article_UnLikeArticleMutation,
        Article_UnLikeArticleMutationVariables
      >(Article_UnLikeArticleDocument, variables);
      const result = await unLikeArticleFetcher();
      setStatus(result?.article_unLikeArticle?.status || null);
      onSuccess?.();
    } catch (err) {
      setError(err as Error); // Handle errors
    } finally {
      setLoading(false);
    }
  };

  return { unLikeScroll, loading, error, status };
};
