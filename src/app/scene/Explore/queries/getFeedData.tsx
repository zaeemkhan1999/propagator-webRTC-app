export const Post_GetPostsInAdvanceWayDocument = `
  query post_getPostsInAdvanceWay(
    $skip: Int
    $take: Int
    $where: PostDtoFilterInput
    $order: [PostDtoSortInput!]
    $getPostType: GetPostType!
  ) {
    post_getPostsInAdvanceWay(getPostType: $getPostType) {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        items {
          posterFollowerCount
          postItemsString
          isLiked
          isNotInterested
          isSaved
          isYourPost
          isViewed
          commentCount
          shareCount
          viewCount
          likeCount
          needAds
          post {
            deletedBy
            isPromote
            bg
            aspectRatio
            postItemsString
            id
            duration
            location
            postType
            postedAt
            yourMind
            createdDate
            allowDownload
            iconLayoutType
            isPin
            isCreatedInGroup
            poster {
              imageAddress
              username
              id
              legalName
              displayName
              isVerified
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        totalCount
      }
      status
    }
  }
`;

export const Post_GetPostsInAdvanceWaySuggestionDocument = `
  query post_getPostsInAdvanceWay(
    $skip: Int
    $take: Int
    $where: PostDtoFilterInput
    $order: [PostDtoSortInput!]
    $getPostType: GetPostType!
  ) {
    post_getPostsInAdvanceWay(getPostType: $getPostType) {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        items {
          postItemsString
          post {
            id
            yourMind
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        totalCount
      }
      status
    }
  }
`;

export interface AdvancePost {
  deletedBy: string | null;
  isPromote: boolean;
  postItemsString: string;
  id: number;
  location: string;
  postType: string;
  postedAt: string;
  yourMind: string;
  createdDate: string;
  allowDownload: boolean;
  isPin: boolean;
  needAds: boolean;
  isCreatedInGroup: boolean;
  poster: {
    imageAddress: string;
    username: string;
    id: number;
    legalName: string;
    displayName: string;
    isVerified: boolean;
  };
  warningBanners: {
    description: string;
    id: number;
    postId: number;
  }[];
}

export interface Post_GetPostsInAdvanceWayResult {
  postItemsString: string;
  isLiked: boolean;
  isNotInterested: boolean;
  isSaved: boolean;
  isYourPost: boolean;
  isViewed: boolean;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  likeCount: number;
  post: AdvancePost;
  needAds: boolean;
}

export interface GridPosts {
  id: number;
  postItemsString: any;
  layout: string;
  height: string;
  post: {
    id: number;
  }
}
