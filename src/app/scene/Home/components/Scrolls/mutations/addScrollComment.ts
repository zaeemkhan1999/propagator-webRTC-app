import { useState } from "react";
import { Exact } from "../../../../../../types/general";
import { fetcher } from "../../../../../../graphql/fetcher";
import { CommentType } from "../../../../../../constants/storage/constant";

// GraphQL mutation
const ArticleComment_CreateArticleCommentDocument = `
  mutation articleComment_createArticleComment($input: ArticleCommentInput) {
    articleComment_createArticleComment(input: $input) {
      status
    }
  }
`;

// Define the input type for the mutation
type ArticleCommentInput = {
  text: string;
  articleId: null | number;
  parentId?: null | number;
  commentType: CommentType;
  contentAddress?: string;
};

// Type definitions for mutation response and variables
type ArticleComment_CreateArticleCommentMutation = {
  __typename?: "Mutation";
  articleComment_createArticleComment?: {
    __typename?: "ResponseBaseOfArticleComment";
    status?: { __typename?: "Status"; code: number; value: string } | null;
  } | null;
};

type ArticleComment_CreateArticleCommentMutationVariables = Exact<{
  input: ArticleCommentInput;
}>;

// TODO: use react-query
// Custom hook for creating an article comment
export const useAddScrollComment = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<{ code: number; value: string } | null>(
    null
  );

  const addScrollComment = async (
    variables: ArticleComment_CreateArticleCommentMutationVariables
  ) => {
    setLoading(true);
    setError(null);

    try {
      const createCommentFetcher = fetcher<
        ArticleComment_CreateArticleCommentMutation,
        ArticleComment_CreateArticleCommentMutationVariables
      >(ArticleComment_CreateArticleCommentDocument, variables);
      const result = await createCommentFetcher();
      setStatus(result?.articleComment_createArticleComment?.status || null);
    } catch (err) {
      setError(err as Error); // Handle errors
    } finally {
      setLoading(false);
    }
  };

  return { addScrollComment, loading, error, status };
};
