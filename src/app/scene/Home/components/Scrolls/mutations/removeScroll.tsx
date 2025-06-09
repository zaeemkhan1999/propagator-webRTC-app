import { useState } from "react";
import { fetcher } from "@/graphql/fetcher";
import { enqueueSnackbar } from "notistack";

const ARTICLE_REMOVE_ARTICLE_DOCUMENT = `
  mutation article_removeArticle($entityId: Int!) {
    article_removeArticle(entityId: $entityId) {
      code
      value
    }
  }
`;

export interface Article_RemoveArticleMutationVariables {
    entityId: number;
}

export interface Article_RemoveArticleMutation {
    article_removeArticle: {
        code: number;
        value: string;
    };
}

export const useRemoveScroll = () => {
    const [loading, setLoading] = useState(false);

    const removeScroll = async (variables: Article_RemoveArticleMutationVariables, onSuccessCallback?: Function) => {
        setLoading(true);

        try {
            const removeAction = fetcher<
                Article_RemoveArticleMutation,
                Article_RemoveArticleMutationVariables
            >(ARTICLE_REMOVE_ARTICLE_DOCUMENT, variables);
            const result = await removeAction();
            if (result.article_removeArticle?.code === 1) {
                onSuccessCallback?.();
                enqueueSnackbar("Scroll Deleted Successfully", {
                    variant: "success",
                    autoHideDuration: 2000,
                });
            } else {
                enqueueSnackbar(result?.article_removeArticle?.value || "An error occurred while deleting the scroll", {
                    variant: "error",
                    autoHideDuration: 2000,
                });
            }
        } catch (err: any) {
            enqueueSnackbar(err?.article_removeArticle?.value || "An error occurred while deleting the scroll", {
                variant: "error",
                autoHideDuration: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    return { removeScroll, loading };
};
