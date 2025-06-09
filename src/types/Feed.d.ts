// Interface for the PostItemString (contains details about the media content)
interface PostItemString {
  Order: number;
  ThumNail: string;
  Content: string;
  SummaryVideoLink: string | null;
  VideoShape: string | null;
  VideoTime: string | null;
  PostItemType: number;
  Width: number;
  Height: number;
}

// Interface for the Poster (user who created the post)
interface Poster {
  imageAddress: string | null;
  username: string;
  id: number;
  legalName: string;
  displayName: string;
  isVerified: boolean;
}

// Interface for the Post (main post details)
interface Post {
  deletedBy: string;
  isPromote: boolean;
  postItemsString: any;
  id: number;
  bg: string;
  aspectRatio: string;
  location: string;
  postType: string;
  postedAt: string;
  yourMind: string;
  iconLayoutType: string;
  createdDate: string;
  allowDownload: boolean;
  isPin: boolean;
  isCreatedInGroup: boolean;
  poster: Poster;
  warningBanners: any[];
}

// Interface for the Main Object
export interface PostData {
  id: number;
  postItemsString: PostItemString;
  isLiked: boolean;
  isNotInterested: boolean;
  isSaved: boolean;
  bg: string;
  aspectRatio: string;
  isYourPost: boolean;
  isViewed: boolean;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  likeCount: number;
  post: Post;
  needAds: boolean;
  layout: string;
  height: string;
  postId: number;
}

// Interface for the ExploreText Object
export interface ExploreText {
  postItemsString: PostItemString;
  isLiked: boolean;
  isNotInterested: boolean;
  isSaved: boolean;
  isYourPost: boolean;
  isViewed: boolean;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  likeCount: number;
  post: {
    savePostsCount: number;
    deletedBy: string;
    isPin: boolean;
    isPromote: boolean;
    bg?: string;
    aspectRatio?: string;
    id: number;
    location: string | null;
    postType: string;
    postedAt: string;
    yourMind: string;
    allowDownload: boolean;
    createdDate: string;
    poster: {
      imageAddress: string;
      username: string;
      id: number;
      isVerified: boolean;
    };
    warningBanners: {
      description: string;
      id: number;
      postId: number;
    }[];
  };
}