import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { fetcher } from "../../../graphql/fetcher";

type RemoveComment_RemoveCommentMutation = {
    comment_removeComment: {
        code: number;
        value: string;
    };
};

type RemoveComment_RemoveCommentMutationVariables = {
    entityId: number;
};

const RemoveComment_RemoveCommentDocument = `
  mutation removeComment($entityId: Int!) {
    comment_removeComment(entityId: $entityId) {
      code
      value
    }
  }
`;

export const useRemoveComment = <
    TError = unknown,
    TContext = unknown
>(
    options?: UseMutationOptions<
        RemoveComment_RemoveCommentMutation,
        TError,
        RemoveComment_RemoveCommentMutationVariables,
        TContext
    >
) =>
    useMutation<
        RemoveComment_RemoveCommentMutation,
        TError,
        RemoveComment_RemoveCommentMutationVariables,
        TContext
    >({
        mutationKey: ["removeComment"],

        mutationFn: (variables?: RemoveComment_RemoveCommentMutationVariables) =>
            fetcher<
                RemoveComment_RemoveCommentMutation,
                RemoveComment_RemoveCommentMutationVariables
            >(RemoveComment_RemoveCommentDocument, variables)(),

        ...options,
    });
