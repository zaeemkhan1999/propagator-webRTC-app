import { useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "../../../graphql/fetcher";
import { CommentType, DeletedBy } from "../../../constants/storage/constant";

const COMMENT_GET_COMMENTS_DOCUMENT = `
  query comment_getComments($skip: Int, $take: Int, $where: CommentDtoFilterInput, $order: [CommentDtoSortInput!], $loadDeleted: Boolean!) {
    comment_getComments(loadDeleted: $loadDeleted) {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        items {
          isLiked
          likeCount
          comment {
            mention {
              username
            }
            mentionId
            deletedBy
            createdDate
            commentType
            contentAddress
            user {
              username
              imageAddress
              id
              legalName
              displayName
            }
            id
            parentId
            parent {
              text
              postId
              userId
              createdAt
              parentId
              commentType
              contentAddress
              id
              user {
                legalName
                displayName
                username
                id
                imageAddress
              }
            }
            text
            children {
              commentType
              contentAddress
              parentId
              text
              id
              likeCount
              createdDate
              user {
                username
                imageAddress
                id
                legalName
                displayName
              }
            }
          }
        }
        totalCount
      }
      status
    }
  }
`;

type Comment_GetCommentsQuery = {
  __typename?: "Query";
  comment_getComments: {
    __typename?: "ListResponseBaseOfCommentDto";
    status: any | null;
    result: {
      __typename?: "CommentDtoCollectionSegment";
      totalCount: number;
      items: Comment_GetCommentsQueryItem[];
    } | null;
  } | null;
};

export interface Comment_GetCommentsQueryItem {
  __typename?: "CommentDto";
  isLiked: boolean;
  likeCount: number;
  comment: {
    __typename?: "Comment";
    mentionId?: number | null;
    deletedBy: DeletedBy;
    createdDate: any;
    commentType: CommentType;
    contentAddress?: string | null;
    postId: number;
    id: number;
    parentId?: number | null;
    text?: string | null;
    mention?: { __typename?: "User"; username?: string | null } | null;
    post: {
      __typename?: "Post";
      yourMind?: string | null;
      postItemsString?: string | null;
      poster?: {
        __typename?: "User";
        username?: string | null;
        imageAddress?: string | null;
        location?: string | null;
        createdDate: any;
      } | null;
    } | null;
    user: {
      __typename?: "User";
      username?: string | null;
      imageAddress?: string | null;
      id: number;
      legalName?: string | null;
      displayName?: string | null;
    } | null;
    parent?: {
      __typename?: "Comment";
      text?: string | null;
      postId: number;
      userId: number;
      createdAt: any;
      parentId?: number | null;
      commentType: CommentType;
      contentAddress?: string | null;
      id: number;
      post?: { __typename?: "Post"; postItemsString?: string | null } | null;
      user?: {
        __typename?: "User";
        legalName?: string | null;
        displayName?: string | null;
        username?: string | null;
        id: number;
        imageAddress?: string | null;
      } | null;
    } | null;
    children?: CommentReply[] | null;
  };
};

export type CommentReply = {
  __typename?: "Comment";
  commentType: CommentType;
  contentAddress?: string | null;
  parentId?: number | null;
  text?: string | null;
  id: number;
  likeCount: number;
  isLiked: boolean;
  createdDate: string;
  user?: {
    __typename?: "User";
    username?: string | null;
    imageAddress?: string | null;
    id: number;
    legalName?: string | null;
    displayName?: string | null;
  } | null;
};

type Comment_GetCommentsQueryVariables = {
  skip?: number;
  take?: number;
  where?: any;
  order?: Array<any>;
  loadDeleted: boolean;
};

export const useGetComments = (
  initialVariables: Comment_GetCommentsQueryVariables,
) => {
  return useInfiniteQuery<
    Comment_GetCommentsQuery,
    Error,
    Comment_GetCommentsQueryItem[]
  >({
    queryKey: ["comments", initialVariables],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetcher<Comment_GetCommentsQuery, Comment_GetCommentsQueryVariables>(
        COMMENT_GET_COMMENTS_DOCUMENT,
        {
          ...initialVariables,
          skip: (pageParam as number) * (initialVariables.take ?? 10),
        }
      )(),
    getNextPageParam: (lastPage) => {
      const items = lastPage?.comment_getComments?.result?.items ?? [];
      return items.length > 0
        ? (pageParam: number) => pageParam + 1
        : undefined;
    },
    select: (data) =>
      data.pages
        .flatMap((page) => page?.comment_getComments?.result?.items)
        .filter((item) => !!item),
    enabled: false,
  });
};
