import {
  Post_GetPostsInAdvanceWayQueryVariables,
  Post_GetPostsQueryVariables,
} from "../../types/general";

export const COLUMN_OPTIONS = "COLUMN_OPTIONS";

export const STORAGE_COMPANY_ID = "companyId";
export const Valid_To = "Valid_To";
export const Permissions = "Permissions";

export enum VerificationRequestAcceptStatus {
  Accepted = "ACCEPTED",
  Pending = "PENDING",
  Rejected = "REJECTED",
}

export enum DeletedBy {
  Admin = "ADMIN",
  NotDeleted = "NOT_DELETED",
  User = "USER",
}

export enum GetPostType {
  Explore = "EXPLORE",
  ForYou = "FOR_YOU",
  MostEngaged = "MOST_ENGAGED",
  MyPosts = "MY_POSTS",
  Newest = "NEWEST",
  News = "NEWS",
  Recommended = "RECOMMENDED"
}

export enum PostType {
  Ads = "ADS",
  Reels = "REELS",
  RegularPost = "REGULAR_POST",
}

export enum FolloweAcceptStatus {
  Accepted = "ACCEPTED",
  Pending = "PENDING",
  Rejected = "REJECTED",
}

export enum CommentType {
  File = "FILE",
  Link = "LINK",
  Photo = "PHOTO",
  Text = "TEXT",
  Video = "VIDEO",
  Voice = "VOICE",
}

export const PostsQueryKeys = {
  all: ["post_getPosts"] as const,

  advancedWay: (variables?: Post_GetPostsInAdvanceWayQueryVariables) => [
    ...PostsQueryKeys.all,
    "advancedWay",
    variables,
  ],
  ads: (variables?: Post_GetPostsQueryVariables) => [
    ...PostsQueryKeys.all,
    "ads",
    variables,
  ],
};
export enum SortEnumType {
  Asc = "ASC",
  Desc = "DESC",
}
export enum MessageType {
  Article = "ARTICLE",
  File = "FILE",
  Link = "LINK",
  Photo = "PHOTO",
  Post = "POST",
  Profile = "PROFILE",
  ReplayStory = "REPLAY_STORY",
  Story = "STORY",
  Text = "TEXT",
  Video = "VIDEO",
  Voice = "VOICE",
}
