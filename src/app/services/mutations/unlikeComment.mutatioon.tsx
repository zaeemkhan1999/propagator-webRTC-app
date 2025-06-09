// import { useMutation } from "@apollo/client";
// import { fetcher } from "../../../graphql/fetcher";
// import { UseMutationOptions } from "react-query";
// import { LikeComment_UnLikeCommentMutation, LikeComment_UnLikeCommentMutationVariables } from "../../../types/general";

// const LikeComment_UnLikeCommentDocument = `
//     mutation likeComment_unLikeComment($input: LikeCommentInput) {
//   likeComment_unLikeComment(input: $input) {
//     code
//     value
//   }
// }
//     `;

// export const useLikeComment_UnLikeCommentMutation = <TError = unknown, TContext = unknown>(
//   options?: UseMutationOptions<
//     LikeComment_UnLikeCommentMutation,
//     TError,
//     LikeComment_UnLikeCommentMutationVariables,
//     TContext
//   >
// ) =>
//   useMutation<
//     LikeComment_UnLikeCommentMutation,
//     TError,
//     LikeComment_UnLikeCommentMutationVariables,
//     TContext
//   >(
//     ['likeComment_unLikeComment'],
//     (variables?: LikeComment_UnLikeCommentMutationVariables) =>
//       fetcher<LikeComment_UnLikeCommentMutation, LikeComment_UnLikeCommentMutationVariables>(
//         LikeComment_UnLikeCommentDocument,
//         variables
//       )(),
//     options
//   );