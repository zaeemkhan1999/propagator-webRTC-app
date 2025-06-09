import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { fetcher } from "../../../graphql/fetcher";

type LikeComment_LikeCommentMutation = {
    likeComment_unLikeComment: {
        code: number
        value: string;
    };
};

type LikeCommentInput = {
    commentId: number;
};

type LikeComment_LikeCommentMutationVariables = {
    input: LikeCommentInput;
};

const LikeComment_LikeCommentDocument = `
  mutation likeComment_unLikeComment($input: LikeCommentInput) {
    likeComment_unLikeComment(input: $input) {
    code
    value
    }
  }
`;

export const useLikeComment_UnLikeCommentMutation = <
    TError = unknown,
    TContext = unknown
>(
    options?: UseMutationOptions<
        LikeComment_LikeCommentMutation,
        TError,
        LikeComment_LikeCommentMutationVariables,
        TContext
    >
) =>
    useMutation<
        LikeComment_LikeCommentMutation,
        TError,
        LikeComment_LikeCommentMutationVariables,
        TContext
    >({
        mutationKey: ["likeComment_unLikeComment"],

        mutationFn: (variables?: LikeComment_LikeCommentMutationVariables) =>
            fetcher<
                LikeComment_LikeCommentMutation,
                LikeComment_LikeCommentMutationVariables
            >(LikeComment_LikeCommentDocument, variables)(),

        ...options,
    });
