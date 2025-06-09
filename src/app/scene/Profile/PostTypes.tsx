export interface Post {
    id: number;
    poster: {
        displayName: string;
        id: number;
    };
    aspectRatio: string;
    bg: string;
    postedAt: string;
    yourMind: string;
    iconLayoutType: string;
    createdDate: string;
}

export interface PostItem {
    Content: string;
    ThumNail: string;
    Post: Post;
    postItemsString?: string;
    isLiked: boolean;
    isNotInterested: boolean;
    iconLayoutType: string;
    isSaved: boolean;
    isYourPost: boolean;
    isViewed: boolean;
    commentCount: number;
    likeCount: number;
    shareCount: number;
    viewCount: number;
    layout: string;
    height: string;
}