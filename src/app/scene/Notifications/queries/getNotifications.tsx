import { useInfiniteQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphqlFetcher } from "../../../../http/graphql.fetcher";

const NOTIFICATION_GET_MY_NOTIFICATIONS_QUERY = gql`
  query notification_getMyNotifications(
    $skip: Int,
    $take: Int,
    $order: [NotificationDtoSortInput!],
    $where: NotificationDtoFilterInput,
  ) {
    notification_getMyNotifications {
      result(skip: $skip, take: $take, order: $order, where: $where) {
        totalCount
        items {
          notification {
            id
            text
            notificationType
            createdDate
            storyLike{
              story{
                storyType
                contentAddress
              }
              user{
                id
                username
                imageAddress
                }
            }
            storyComment{
               text
               story{
                    storyType
                    contentAddress
                  }
                user{
                    id
                    username
                    imageAddress
                  }
              }
            sender {
              imageAddress
            }
            article {
              articleItemsString
            }
            postLike {
              post {
                id
                postItemsString
                postType
                iconLayoutType
              }
            }
            articleLike {
              article {
                id
                title
                articleItemsString
                articleType
              }
            }
            likeComment {
              comment {
                text
                post {
                  id
                  yourMind
                  postItemsString
                }
              }
            }
            likeArticleComment {
              articleComment {
                id
                text
                contentAddress
              }
            }
              comment {
               id
               text
               parent {
                text
               }
               post{
                    id
                    yourMind
                    postItemsString
                    }
              }
            post {
              id
              yourMind
              postItemsString
            }
            articleComment {
              id
              text
              contentAddress
            }
            sender {
              id
              username
              imageAddress
            }
          }
        }
      }
      status
    }
  }
`;

export interface Post {
  id: number;
  postItemsString: string;
  postType: string;
  iconLayoutType: string;
}

export interface Article {
  id: number;
  title: string;
  articleItemsString: string;
  articleType: string;
}

export interface Sender {
  id: number;
  username: string;
  imageAddress: string;
}

export interface NotificationItem {
  id: number;
  text: string;
  notificationType: string;
  createdDate: string;
  storyLike?: {
    user: Sender;
    story: {
      storyType: string;
      contentAddress: string;
    };
  };
  storyComment?: {
    text: string;
    story: {
      storyType: string;
      contentAddress: string;
    };
    user: Sender;
  };
  postLike?: {
    post: Post;
  };
  articleLike?: {
    article: Article;
  };
  likeComment?: {
    comment: {
      text: string;
      post: Post;
    };
  };
  likeArticleComment?: {
    articleComment: {
      id: number;
      text: string;
      contentAddress: string;
    };
  };
  comment: {
    id: number;
    text: string;
    parent?: {
      text?: string;
    };
    post: {
      id: number
      yourMind: string;
      postItemsString: string;
    }
  }
  post?: Post;
  articleComment?: {
    id: number;
    text: string;
    contentAddress: string;
  };
  sender: Sender;
}

export interface Notification {
  notification: NotificationItem;
}

interface NotificationResult {
  items: Notification[];
  totalCount: number;
};

interface NotificationGetResponse {
  notification_getMyNotifications: {
    result: NotificationResult;
    status: {
      code: number;
      value: string;
    };
  };
}

export const useGetNotifications = () => {
  return useInfiniteQuery<NotificationGetResponse, Error>({
    queryKey: ["notification_getMyNotifications"],
    queryFn: ({ pageParam = 0 }) =>
      graphqlFetcher(NOTIFICATION_GET_MY_NOTIFICATIONS_QUERY, {
        skip: pageParam,
        take: 10,
        order: [
          {
            notification: {
              createdDate: "DESC",
            },
          },
        ],
        where: {
          notification: {
            isReaded: { eq: false }
          }
        }
      }),
    getNextPageParam: (lastPage, pages) => {
      const totalNotifications =
        lastPage?.notification_getMyNotifications?.result?.totalCount || 0;
      const currentCount = pages.length * 10;
      return currentCount < totalNotifications ? currentCount : undefined;
    },
    initialPageParam: 0,
    enabled: false,
  });
};
