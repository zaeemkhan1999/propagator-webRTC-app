import { useState } from "react";
import { fetcher } from "../../../../../../graphql/fetcher";
import {
  Article_CreateArticleMutation,
  Article_CreateArticleMutationVariables,
} from "../../../../../../types/general";
import { enqueueSnackbar } from "notistack";

const ARTICLE_CREATE_ARTICLE_DOCUMENT = `
  mutation article_createArticle($input: ArticleInput) {
    article_createArticle(input: $input) {
      result {
        id
      }
      status
    }
  }
`;

export const useCreateArticleMutation = () => {
  const [loading, setLoading] = useState(false);

  const createArticle = async (
    variables: Article_CreateArticleMutationVariables,
    onSuccess?: (id: number) => void
  ) => {
    setLoading(true);

    try {
      const getData = fetcher<Article_CreateArticleMutation, Article_CreateArticleMutationVariables>(ARTICLE_CREATE_ARTICLE_DOCUMENT, variables);
      const result = await getData();

      if (result?.article_createArticle?.status?.code === 1 && result?.article_createArticle?.result?.id) {
        enqueueSnackbar("Scroll created successfully", { variant: "success", autoHideDuration: 3000 });
        onSuccess?.(result?.article_createArticle?.result?.id);
      } else {
        enqueueSnackbar(result?.article_createArticle?.status?.value || "Unable to create Scroll", { variant: "error", autoHideDuration: 3000 });
      }
    } catch (err: any) {
      enqueueSnackbar(err?.article_createArticle?.status?.value || "Unable to create Scroll", { variant: "error", autoHideDuration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return { createArticle, loading };
};
