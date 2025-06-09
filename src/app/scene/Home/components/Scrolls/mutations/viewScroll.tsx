import { fetcher } from "@/graphql/fetcher";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { gql } from "graphql-request";

type AddViewMutationVariables = {
    articleId: number;
};

type AddViewMutationResponse = {
    article_addViewToArticle: {
        result: {
            id: string;
        };
        status: string;
    };
};

const ADD_VIEW_MUTATION = gql`
  mutation article_addViewToArticle($articleId: Int!) {
    article_addViewToArticle(articleId: $articleId) {
      result {
        id
      }
      status
    }
  }
`;

export const useAddViewToArticle = (
    options?: UseMutationOptions<
        AddViewMutationResponse,
        Error,
        AddViewMutationVariables
    >
) => {
    return useMutation<AddViewMutationResponse, Error, AddViewMutationVariables>({
        mutationFn: (variables: AddViewMutationVariables) =>
            fetcher<AddViewMutationResponse, AddViewMutationVariables>(
                ADD_VIEW_MUTATION,
                variables
            )(),
        ...options,
    });
};