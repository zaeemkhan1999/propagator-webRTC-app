import { CommentType, SortEnumType } from "../constants/storage/constant";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
    [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
  };

export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Any: { input: any; output: any };
  Coordinates: { input: any; output: any };
  DateTime: { input: any; output: any };
  Decimal: { input: any; output: any };
  Geometry: { input: any; output: any };
  Position: { input: any; output: any };
};

export type LoginInput = {
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type SignUpInput = {
  // dateOfBirth: Scalars["DateTime"]["input"];
  displayName: Scalars["String"]["input"];
  // email?: InputMaybe<Scalars["String"]["input"]>;
  // enableTwoFactorAuthentication: Scalars["Boolean"]["input"];
  gender: Gender;
  // ip?: InputMaybe<Scalars["String"]["input"]>;
  // legalName: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type VerificationRequestInput = {
  governmentIssuePhotoId: Scalars["String"]["input"];
  id?: InputMaybe<Scalars["Int"]["input"]>;
  otheFiles: Array<InputMaybe<Scalars["String"]["input"]>>;
  proofOfAddress: Scalars["String"]["input"];
  verificationRequestAcceptStatus: VerificationRequestAcceptStatus;
};

export type Post_GetPostsInAdvanceWayQueryVariables = Exact<{
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  take?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<PostDtoFilterInput>;
  order?: InputMaybe<Array<PostDtoSortInput> | PostDtoSortInput>;
  getPostType: GetPostType;
}>;

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars["Int"]["input"]>;
  gt?: InputMaybe<Scalars["Int"]["input"]>;
  gte?: InputMaybe<Scalars["Int"]["input"]>;
  in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  lt?: InputMaybe<Scalars["Int"]["input"]>;
  lte?: InputMaybe<Scalars["Int"]["input"]>;
  neq?: InputMaybe<Scalars["Int"]["input"]>;
  ngt?: InputMaybe<Scalars["Int"]["input"]>;
  ngte?: InputMaybe<Scalars["Int"]["input"]>;
  nin?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  nlt?: InputMaybe<Scalars["Int"]["input"]>;
  nlte?: InputMaybe<Scalars["Int"]["input"]>;
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  neq?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ChangePasswordInput = {
  newPassword: Scalars["String"]["input"];
  oldPassword: Scalars["String"]["input"];
};

export type PostFilterInput = {
  adses?: InputMaybe<ListFilterInputTypeOfAdsFilterInput>;
  allowDownload?: InputMaybe<BooleanOperationFilterInput>;
  and?: InputMaybe<Array<PostFilterInput>>;
  comments?: InputMaybe<ListFilterInputTypeOfCommentFilterInput>;
  commentsCount?: InputMaybe<IntOperationFilterInput>;
  createdDate?: InputMaybe<DateTimeOperationFilterInput>;
  deletedBy?: InputMaybe<DeletedByOperationFilterInput>;
  hits?: InputMaybe<IntOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  interestedUsers?: InputMaybe<ListFilterInputTypeOfInterestedUserFilterInput>;
  isByAdmin?: InputMaybe<BooleanOperationFilterInput>;
  isCompletedPayment?: InputMaybe<BooleanOperationFilterInput>;
  isCreatedInGroup?: InputMaybe<BooleanOperationFilterInput>;
  isDeleted?: InputMaybe<BooleanOperationFilterInput>;
  isEdited?: InputMaybe<BooleanOperationFilterInput>;
  isPin?: InputMaybe<BooleanOperationFilterInput>;
  isPromote?: InputMaybe<BooleanOperationFilterInput>;
  lastModifiedDate?: InputMaybe<DateTimeOperationFilterInput>;
  latestPromoteDate?: InputMaybe<DateTimeOperationFilterInput>;
  latestUpdateThisWeeks?: InputMaybe<DateTimeOperationFilterInput>;
  likes?: InputMaybe<ListFilterInputTypeOfPostLikesFilterInput>;
  likesCount?: InputMaybe<IntOperationFilterInput>;
  links?: InputMaybe<ListFilterInputTypeOfLinkFilterInput>;
  location?: InputMaybe<StringOperationFilterInput>;
  messages?: InputMaybe<ListFilterInputTypeOfMessageFilterInput>;
  notInterestedPosts?: InputMaybe<ListFilterInputTypeOfNotInterestedPostFilterInput>;
  notInterestedPostsCount?: InputMaybe<IntOperationFilterInput>;
  notifications?: InputMaybe<ListFilterInputTypeOfNotificationFilterInput>;
  or?: InputMaybe<Array<PostFilterInput>>;
  pinDate?: InputMaybe<DateTimeOperationFilterInput>;
  postItemsString?: InputMaybe<StringOperationFilterInput>;
  postType?: InputMaybe<PostTypeOperationFilterInput>;
  postedAt?: InputMaybe<DateTimeOperationFilterInput>;
  poster?: InputMaybe<UserFilterInput>;
  posterId?: InputMaybe<IntOperationFilterInput>;
  reports?: InputMaybe<ListFilterInputTypeOfReportFilterInput>;
  savePosts?: InputMaybe<ListFilterInputTypeOfSavePostFilterInput>;
  savePostsCount?: InputMaybe<IntOperationFilterInput>;
  shareCount?: InputMaybe<IntOperationFilterInput>;
  stories?: InputMaybe<ListFilterInputTypeOfStoryFilterInput>;
  strikes?: InputMaybe<ListFilterInputTypeOfStrikeFilterInput>;
  stringTags?: InputMaybe<StringOperationFilterInput>;
  tags?: InputMaybe<ListStringOperationFilterInput>;
  thisWeekCommentsCount?: InputMaybe<IntOperationFilterInput>;
  thisWeekHits?: InputMaybe<IntOperationFilterInput>;
  thisWeekLikesCount?: InputMaybe<IntOperationFilterInput>;
  thisWeekNotInterestedPostsCount?: InputMaybe<IntOperationFilterInput>;
  thisWeekSavePostsCount?: InputMaybe<IntOperationFilterInput>;
  thisWeekShareCount?: InputMaybe<IntOperationFilterInput>;
  userSearchPosts?: InputMaybe<ListFilterInputTypeOfUserSearchPostFilterInput>;
  userViewPosts?: InputMaybe<ListFilterInputTypeOfUserViewPostFilterInput>;
  userVisitLinks?: InputMaybe<ListFilterInputTypeOfUserVisitLinkFilterInput>;
  warningBanners?: InputMaybe<ListFilterInputTypeOfWarningBannerFilterInput>;
  yourMind?: InputMaybe<StringOperationFilterInput>;
};

export type ListFilterInputTypeOfCommentDtoFilterInput = {
  all?: InputMaybe<CommentDtoFilterInput>;
  any?: InputMaybe<Scalars["Boolean"]["input"]>;
  none?: InputMaybe<CommentDtoFilterInput>;
  some?: InputMaybe<CommentDtoFilterInput>;
};

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  eq?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  ncontains?: InputMaybe<Scalars["String"]["input"]>;
  nendsWith?: InputMaybe<Scalars["String"]["input"]>;
  neq?: InputMaybe<Scalars["String"]["input"]>;
  nin?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  nstartsWith?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type PostDtoSortInput = {
  commentCount?: InputMaybe<SortEnumType>;
  isCompletedPayment?: InputMaybe<SortEnumType>;
  isLiked?: InputMaybe<SortEnumType>;
  isNotInterested?: InputMaybe<SortEnumType>;
  isSaved?: InputMaybe<SortEnumType>;
  isViewed?: InputMaybe<SortEnumType>;
  isYourPost?: InputMaybe<SortEnumType>;
  likeCount?: InputMaybe<SortEnumType>;
  notInterestedPostsCount?: InputMaybe<SortEnumType>;
  post?: InputMaybe<PostSortInput>;
  postItemsString?: InputMaybe<SortEnumType>;
  shareCount?: InputMaybe<SortEnumType>;
  viewCount?: InputMaybe<SortEnumType>;
};
type Post_CreatePostMutation = {
  __typename?: "Mutation";
  post_createPost?: {
    __typename?: "ResponseBaseOfPost";
    status?: { code: number, value: string } | null;
    result?: { __typename?: "Post"; id: number } | null;
  } | null;
};

type PostInput = {
  allowDownload: boolean;
  id?: InputMaybe<Scalars["number"]>;
  isByAdmin: Scalars["boolean"];
  isCreatedInGroup: Scalars["boolean"];
  linkInputs?: InputMaybe<Array<InputMaybe<LinkInput>>>;
  location?: InputMaybe<Scalars["string"]>;
  postItems: Array<InputMaybe<PostItemInput>>;
  posterId?: InputMaybe<Scalars["number"]>;
  tags?: InputMaybe<Array<InputMaybe<Scalars["string"]>>>;
  yourMind: Scalars["string"];
};

type Post_CreatePostMutationVariables = Exact<{
  input?: InputMaybe<PostInput>;
}>;

export type Place_GetPlacesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  take?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<PlaceFilterInput>;
  order?: InputMaybe<Array<PlaceSortInput> | PlaceSortInput>;
}>;

export type Place_GetPlacesQuery = {
  __typename?: "Query";
  place_getPlaces?: {
    __typename?: "ListResponseBaseOfPlace";
    status?: { code: number, value: string } | null;
    result?: {
      __typename?: "PlaceCollectionSegment";
      totalCount: number;
      items?: Array<{
        __typename?: "Place";
        id: number;
        location?: string | null;
      } | null> | null;
    } | null;
  } | null;
};

export type PlaceFilterInput = {
  and?: InputMaybe<Array<PlaceFilterInput>>;
  createdDate?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isDeleted?: InputMaybe<BooleanOperationFilterInput>;
  lastModifiedDate?: InputMaybe<DateTimeOperationFilterInput>;
  location?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PlaceFilterInput>>;
};

export type Article_CreateArticleMutationVariables = Exact<{
  input?: InputMaybe<ArticleInput>;
}>;

export type ArticleInput = {
  articleItems?: InputMaybe<Array<InputMaybe<ArticleItemInput>>>;
  author: Scalars["String"]["input"];
  id?: InputMaybe<Scalars["Int"]["input"]>;
  isByAdmin: Scalars["Boolean"]["input"];
  isCreatedInGroup: Scalars["Boolean"]["input"];
  linkInputs?: InputMaybe<Array<InputMaybe<LinkInput>>>;
  subTitle: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
  createdDate?: InputMaybe<DateTimeOperationFilterInput>;
};

export type Article_CreateArticleMutation = {
  __typename?: "Mutation";
  article_createArticle?: {
    __typename?: "ResponseBaseOfArticle";
    status?: { code: number, value: string } | null;
    result?: { __typename?: "Article"; id: number } | null;
  } | null;
};

export type Message_CreateConversationGroupMutation = {
  __typename?: "Mutation";
  message_createConversationGroup?: {
    __typename?: "ResponseBaseOfConversation";
    status?: { code: number, value: string } | null;
  } | null;
};

export type Message_CreateConversationGroupMutationVariables = Exact<{
  input?: InputMaybe<GroupMessageInput>;
  userIds?: InputMaybe<
    Array<Scalars["Int"]["input"]> | Scalars["Int"]["input"]
  >;
}>;

export type GroupMessageInput = {
  groupDescription?: InputMaybe<Scalars["String"]["input"]>;
  groupImgageUrl?: InputMaybe<Scalars["String"]["input"]>;
  groupLink?: InputMaybe<Scalars["String"]["input"]>;
  groupName: Scalars["String"]["input"];
  isPrivate: Scalars["Boolean"]["input"];
  isShare: Scalars["Boolean"]["input"];
};

export type Post_GetPostsQueryVariables = Exact<{
  skip?: any;
  take?: any;
  where?: InputMaybe<PostDtoFilterInput>;
  order?: InputMaybe<Array<PostDtoSortInput> | PostDtoSortInput>;
}>;

export type PostDtoSortInput = {
  commentCount?: InputMaybe<SortEnumType>;
  isCompletedPayment?: InputMaybe<SortEnumType>;
  isLiked?: InputMaybe<SortEnumType>;
  isNotInterested?: InputMaybe<SortEnumType>;
  isSaved?: InputMaybe<SortEnumType>;
  isViewed?: InputMaybe<SortEnumType>;
  isYourPost?: InputMaybe<SortEnumType>;
  likeCount?: InputMaybe<SortEnumType>;
  notInterestedPostsCount?: InputMaybe<SortEnumType>;
  post?: InputMaybe<PostSortInput>;
  postItemsString?: InputMaybe<SortEnumType>;
  shareCount?: InputMaybe<SortEnumType>;
  viewCount?: InputMaybe<SortEnumType>;
};

export type Post_GetPostsQuery = {
  __typename?: "Query";
  post_getPosts?: {
    __typename?: "ListResponseBaseOfPostDto";
    status?: { code: number, value: string } | null;
    result?: {
      __typename?: "PostDtoCollectionSegment";
      totalCount: number;
      items?: Array<{
        __typename?: "PostDto";
        postItemsString?: string | null;
        isLiked: boolean;
        isNotInterested: boolean;
        isSaved: boolean;
        isYourPost: boolean;
        isViewed: boolean;
        commentCount: number;
        shareCount: number;
        viewCount: number;
        likeCount: number;
        post?: {
          __typename?: "Post";
          savePostsCount: number;
          deletedBy: DeletedBy;
          isPin: boolean;
          isPromote: boolean;
          bg: string;
          aspectRatio: string;
          id: number;
          location?: string | null;
          iconLayoutType: string;
          postType: PostType;
          postedAt: any;
          yourMind?: string | null;
          allowDownload: boolean;
          createdDate: any;
          poster?: {
            __typename?: "User";
            imageAddress?: string | null;
            username?: string | null;
            id: number;
            isVerified: boolean;
          } | null;
          warningBanners?: Array<{
            __typename?: "WarningBanner";
            description?: string | null;
            id: number;
            postId?: number | null;
          } | null> | null;
        } | null;
      } | null> | null;
      pageInfo: {
        __typename?: "CollectionSegmentInfo";
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
    } | null;
  } | null;
};

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars["Int"]>;
  gt?: InputMaybe<Scalars["Int"]>;
  gte?: InputMaybe<Scalars["Int"]>;
  in?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  lt?: InputMaybe<Scalars["Int"]>;
  lte?: InputMaybe<Scalars["Int"]>;
  neq?: InputMaybe<Scalars["Int"]>;
  ngt?: InputMaybe<Scalars["Int"]>;
  ngte?: InputMaybe<Scalars["Int"]>;
  nin?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  nlt?: InputMaybe<Scalars["Int"]>;
  nlte?: InputMaybe<Scalars["Int"]>;
};
export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars["Boolean"]>;
  neq?: InputMaybe<Scalars["Boolean"]>;
};
export type MessageTypeOperationFilterInput = {
  eq?: InputMaybe<MessageType>;
  in?: InputMaybe<Array<MessageType>>;
  neq?: InputMaybe<MessageType>;
  nin?: InputMaybe<Array<MessageType>>;
};

export type DiscussionsDtoFilterInput = {
  groupTopicId?: InputMaybe<IntOperationFilterInput>;
  and?: InputMaybe<Array<DiscussionsDtoFilterInput>>;
  article?: InputMaybe<ArticleFilterInput>;
  commentCount?: InputMaybe<IntOperationFilterInput>;
  conversationId?: InputMaybe<IntOperationFilterInput>;
  createdDate?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isDeleted?: InputMaybe<BooleanOperationFilterInput>;
  isLiked?: InputMaybe<BooleanOperationFilterInput>;
  isNotInterested?: InputMaybe<BooleanOperationFilterInput>;
  isSaved?: InputMaybe<BooleanOperationFilterInput>;
  isViewed?: InputMaybe<BooleanOperationFilterInput>;
  isYours?: InputMaybe<BooleanOperationFilterInput>;
  itemsString?: InputMaybe<StringOperationFilterInput>;
  lastModifiedDate?: InputMaybe<DateTimeOperationFilterInput>;
  likeCount?: InputMaybe<IntOperationFilterInput>;
  messageType?: InputMaybe<MessageTypeOperationFilterInput>;
  or?: InputMaybe<Array<DiscussionsDtoFilterInput>>;
  post?: InputMaybe<PostFilterInput>;
  shareCount?: InputMaybe<IntOperationFilterInput>;
  viewCount?: InputMaybe<IntOperationFilterInput>;
};

export type DiscussionsDtoSortInput = {
  article?: InputMaybe<ArticleSortInput>;
  commentCount?: InputMaybe<SortEnumType>;
  conversationId?: InputMaybe<SortEnumType>;
  createdDate?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isDeleted?: InputMaybe<SortEnumType>;
  isLiked?: InputMaybe<SortEnumType>;
  isNotInterested?: InputMaybe<SortEnumType>;
  isSaved?: InputMaybe<SortEnumType>;
  isViewed?: InputMaybe<SortEnumType>;
  isYours?: InputMaybe<SortEnumType>;
  itemsString?: InputMaybe<SortEnumType>;
  lastModifiedDate?: InputMaybe<SortEnumType>;
  likeCount?: InputMaybe<SortEnumType>;
  messageType?: InputMaybe<SortEnumType>;
  post?: InputMaybe<PostSortInput>;
  shareCount?: InputMaybe<SortEnumType>;
  viewCount?: InputMaybe<SortEnumType>;
};

export type Message_GetDiscussionsQueryVariables = Exact<{
  skip?: number;
  take?: number;
  where?: InputMaybe<DiscussionsDtoFilterInput>;
  order?: InputMaybe<Array<DiscussionsDtoSortInput> | DiscussionsDtoSortInput>;
}>;

export type Message_GetDiscussionsQuery = {
  __typename?: "Query";
  message_getDiscussions?: {
    __typename?: "ListResponseBaseOfDiscussionsDto";
    status?: { code: number, value: string } | null;
    result?: {
      __typename?: "DiscussionsDtoCollectionSegment";
      totalCount: number;
      items?: Array<{
        __typename?: "DiscussionsDto";
        commentCount: number;
        isLiked: boolean;
        isNotInterested: boolean;
        isSaved: boolean;
        isViewed: boolean;
        likeCount: number;
        shareCount: number;
        viewCount: number;
        article?: {
          __typename?: "Article";
          title?: string | null;
          subTitle?: string | null;
          author?: string | null;
          isVerifield: boolean;
          isPromote: boolean;
          id: number;
          isPin: boolean;
          articleItemsString?: string | null;
          user?: {
            __typename?: "User";
            id: number;
            imageAddress?: string | null;
            legalName?: string | null;
            displayName?: string | null;
            username?: string | null;
            isVerified: boolean;
          } | null;
        } | null;
        post?: {
          __typename?: "Post";
          postItemsString?: string | null;
          allowDownload: boolean;
          isPromote: boolean;
          isPin: boolean;
          id: number;
          location?: string | null;
          postType: PostType;
          postedAt: any;
          yourMind?: string | null;
          createdDate: any;
          poster?: {
            __typename?: "User";
            imageAddress?: string | null;
            username?: string | null;
            legalName?: string | null;
            displayName?: string | null;
            location?: string | null;
            id: number;
            isVerified: boolean;
          } | null;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};

type ConversationDtoSortInput = {
  admin?: InputMaybe<UserSortInput>;
  adminId?: InputMaybe<SortEnumType>;
  bio?: InputMaybe<SortEnumType>;
  conversationId?: InputMaybe<SortEnumType>;
  cover?: InputMaybe<SortEnumType>;
  dateOfBirth?: InputMaybe<SortEnumType>;
  displayName?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  firstUserDeletedDate?: InputMaybe<SortEnumType>;
  groupDescription?: InputMaybe<SortEnumType>;
  groupImgageUrl?: InputMaybe<SortEnumType>;
  groupLink?: InputMaybe<SortEnumType>;
  groupMemberCount?: InputMaybe<SortEnumType>;
  groupName?: InputMaybe<SortEnumType>;
  imageAddress?: InputMaybe<SortEnumType>;
  isFirstUserDeleted?: InputMaybe<SortEnumType>;
  isGroup?: InputMaybe<SortEnumType>;
  isMemberOfGroup?: InputMaybe<SortEnumType>;
  isPrivate?: InputMaybe<SortEnumType>;
  isSecondUserDeleted?: InputMaybe<SortEnumType>;
  lastMessage?: InputMaybe<MessageSortInput>;
  lastSeen?: InputMaybe<SortEnumType>;
  latestMessageDate?: InputMaybe<SortEnumType>;
  latestMessageUserId?: InputMaybe<SortEnumType>;
  secondUserDeletedDate?: InputMaybe<SortEnumType>;
  unreadCount?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  userTypes?: InputMaybe<SortEnumType>;
  username?: InputMaybe<SortEnumType>;
};

// Define types for the group query variables
export type Message_GetGroupsQueryVariables = Exact<{
  skip?: any;
  take?: any;
  where?: InputMaybe<ConversationDtoFilterInput>;
  order?: InputMaybe<
    Array<ConversationDtoSortInput> | ConversationDtoSortInput
  >;
  userId?: any;
}>;

export type Follow_GetFollowingsQuery = {
  __typename?: "Query";
  follow_getFollowings?: {
    __typename?: "ListResponseBaseOfUserFollower";
    status?: { code: number, value: string } | null;
    result?: {
      __typename?: "UserFollowerCollectionSegment";
      totalCount: number;
      items?: Array<{
        __typename?: "UserFollower";
        followedId: number;
        followerId: number;
        followeAcceptStatus: FolloweAcceptStatus;
        followed?: {
          __typename?: "User";
          legalName?: string | null;
          displayName?: string | null;
          imageAddress?: string | null;
          id: number;
          username?: string | null;
        } | null;
        follower?: {
          __typename?: "User";
          username?: string | null;
          imageAddress?: string | null;
          id: number;
          legalName?: string | null;
          displayName?: string | null;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};

export type UserFilterInput = {
  and?: InputMaybe<Array<UserFilterInput>>;
  appealAdss?: InputMaybe<ListFilterInputTypeOfAppealAdsFilterInput>;
  articleCommentMentions?: InputMaybe<ListFilterInputTypeOfArticleCommentFilterInput>;
  bio?: InputMaybe<StringOperationFilterInput>;
  blockers?: InputMaybe<ListFilterInputTypeOfBlockUserFilterInput>;
  blocks?: InputMaybe<ListFilterInputTypeOfBlockUserFilterInput>;
  commentMentions?: InputMaybe<ListFilterInputTypeOfCommentFilterInput>;
  commentNotification?: InputMaybe<BooleanOperationFilterInput>;
  commentPosts?: InputMaybe<ListFilterInputTypeOfCommentFilterInput>;
  countryCode?: InputMaybe<StringOperationFilterInput>;
  cover?: InputMaybe<StringOperationFilterInput>;
  createdDate?: InputMaybe<DateTimeOperationFilterInput>;
  dateOfBirth?: InputMaybe<DateTimeOperationFilterInput>;
  deleteAccountDate?: InputMaybe<DateTimeOperationFilterInput>;
  directNotification?: InputMaybe<BooleanOperationFilterInput>;
  displayName?: InputMaybe<StringOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  eventModels?: InputMaybe<ListFilterInputTypeOfEventModelFilterInput>;
  externalId?: InputMaybe<StringOperationFilterInput>;
  followeBacknotification?: InputMaybe<BooleanOperationFilterInput>;
  followees?: InputMaybe<ListFilterInputTypeOfUserFollowerFilterInput>;
  followers?: InputMaybe<ListFilterInputTypeOfUserFollowerFilterInput>;
  gender?: InputMaybe<GenderOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  imageAddress?: InputMaybe<StringOperationFilterInput>;
  interestedUsers?: InputMaybe<ListFilterInputTypeOfInterestedUserFilterInput>;
  ip?: InputMaybe<StringOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isDeleted?: InputMaybe<BooleanOperationFilterInput>;
  isDeletedAccount?: InputMaybe<BooleanOperationFilterInput>;
  isSuspended?: InputMaybe<BooleanOperationFilterInput>;
  isVerified?: InputMaybe<BooleanOperationFilterInput>;
  lastModifiedDate?: InputMaybe<DateTimeOperationFilterInput>;
  lastSeen?: InputMaybe<DateTimeOperationFilterInput>;
  legalName?: InputMaybe<StringOperationFilterInput>;
  likeNotification?: InputMaybe<BooleanOperationFilterInput>;
  linkBio?: InputMaybe<StringOperationFilterInput>;
  location?: InputMaybe<StringOperationFilterInput>;
  notInterestedArticleIds?: InputMaybe<ListIntOperationFilterInput>;
  notInterestedPostIds?: InputMaybe<ListIntOperationFilterInput>;
  notInterestedPosts?: InputMaybe<ListFilterInputTypeOfNotInterestedPostFilterInput>;
  or?: InputMaybe<Array<UserFilterInput>>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  phoneNumberConfirmed?: InputMaybe<BooleanOperationFilterInput>;
  privateAccount?: InputMaybe<BooleanOperationFilterInput>;
  professionalAccount?: InputMaybe<BooleanOperationFilterInput>;
  resetPasswordRequests?: InputMaybe<ListFilterInputTypeOfResetPasswordRequestFilterInput>;
  saveArticles?: InputMaybe<ListFilterInputTypeOfSaveArticleFilterInput>;
  savePosts?: InputMaybe<ListFilterInputTypeOfSavePostFilterInput>;
  stripeAccountId?: InputMaybe<StringOperationFilterInput>;
  stripeCustomerId?: InputMaybe<StringOperationFilterInput>;
  subscriptionId?: InputMaybe<StringOperationFilterInput>;
  suspensionLiftingDate?: InputMaybe<DateTimeOperationFilterInput>;
  userDiscounts?: InputMaybe<ListFilterInputTypeOfUserDiscountFilterInput>;
  userSearchArticles?: InputMaybe<ListFilterInputTypeOfUserSearchArticleFilterInput>;
  userTypes?: InputMaybe<UserTypesOperationFilterInput>;
  userViewArticles?: InputMaybe<ListFilterInputTypeOfUserViewArticleFilterInput>;
  username?: InputMaybe<StringOperationFilterInput>;
};

type UserFollowerFilterInput = {
  and?: InputMaybe<Array<UserFollowerFilterInput>>;
  createdDate?: InputMaybe<DateTimeOperationFilterInput>;
  followeAcceptStatus?: InputMaybe<FolloweAcceptStatusOperationFilterInput>;
  followed?: InputMaybe<UserFilterInput>;
  followedAt?: InputMaybe<DateTimeOperationFilterInput>;
  followedId?: InputMaybe<IntOperationFilterInput>;
  follower?: InputMaybe<UserFilterInput>;
  followerId?: InputMaybe<IntOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isDeleted?: InputMaybe<BooleanOperationFilterInput>;
  isMutual?: InputMaybe<BooleanOperationFilterInput>;
  lastModifiedDate?: InputMaybe<DateTimeOperationFilterInput>;
  notifications?: InputMaybe<ListFilterInputTypeOfNotificationFilterInput>;
  or?: InputMaybe<Array<UserFollowerFilterInput>>;
};

export type UserFollowerSortInput = {
  createdDate?: InputMaybe<SortEnumType>;
  followeAcceptStatus?: InputMaybe<SortEnumType>;
  followed?: InputMaybe<UserSortInput>;
  followedAt?: InputMaybe<SortEnumType>;
  followedId?: InputMaybe<SortEnumType>;
  follower?: InputMaybe<UserSortInput>;
  followerId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isDeleted?: InputMaybe<SortEnumType>;
  isMutual?: InputMaybe<SortEnumType>;
  lastModifiedDate?: InputMaybe<SortEnumType>;
};

export type Follow_GetFollowingsQueryVariables = Exact<{
  skip?: number;
  take?: number;
  where?: InputMaybe<UserFollowerFilterInput>;
  order?: InputMaybe<Array<UserFollowerSortInput> | UserFollowerSortInput>;
}>;

export type Article_GetArticleQueryVariables = Exact<{
  entityId: number;
}>;

export type Article_GetArticleQuery = {
  __typename?: "Query";
  article_getArticle?: {
    __typename?: "SingleResponseBaseOfArticleDto";
    status?: { code: number, value: string } | null;
    result?: {
      __typename?: "ArticleDto";
      isViewed: boolean;
      isSaved: boolean;
      isNotInterested: boolean;
      isLiked: boolean;
      isYourArticle: boolean;
      commentCount: number;
      shareCount: number;
      viewCount: number;
      likeCount: number;
      articleItemsString?: string | null;
      article?: {
        __typename?: "Article";
        createdDate: any;
        title?: string | null;
        subTitle?: string | null;
        author?: string | null;
        isVerifield: boolean;
        isPromote: boolean;
        id: number;
        isPin: boolean;
        user?: {
          __typename?: "User";
          id: number;
          imageAddress?: string | null;
          legalName?: string | null;
          displayName?: string | null;
          username?: string | null;
          location?: string | null;
        } | null;
      } | null;
    } | null;
  } | null;
};

export type CommentDtoFilterInput = {
  and?: InputMaybe<Array<CommentDtoFilterInput>>;
  childrenCount?: InputMaybe<IntOperationFilterInput>;
  comment?: InputMaybe<CommentFilterInput>;
  hasChild?: InputMaybe<BooleanOperationFilterInput>;
  isLiked?: InputMaybe<BooleanOperationFilterInput>;
  likeCount?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<CommentDtoFilterInput>>;
};

export type Comment_GetCommentsQueryVariables = Exact<{
  skip?: number;
  take?: number;
  where?: InputMaybe<CommentDtoFilterInput>;
  order?: InputMaybe<Array<CommentDtoSortInput> | CommentDtoSortInput>;
  loadDeleted: Scalars["Boolean"];
}>;

export type CommentDtoSortInput = {
  childrenCount?: InputMaybe<SortEnumType>;
  comment?: InputMaybe<CommentSortInput>;
  hasChild?: InputMaybe<SortEnumType>;
  isLiked?: InputMaybe<SortEnumType>;
  likeCount?: InputMaybe<SortEnumType>;
};

export type Post_SavePostMutationVariables = Exact<{
  postId: number;
  liked: boolean;
}>;

export type Post_SavePostMutation = {
  __typename?: "Mutation";
  post_savePost?: { __typename?: "ResponseBase"; status?: any | null } | null;
};

export type NotInterestedPost_AddNotInterestedPostMutationVariables = Exact<{
  input?: InputMaybe<NotInterestedPostInput>;
}>;

export type NotInterestedPost_AddNotInterestedPostMutation = {
  __typename?: "Mutation";
  notInterestedPost_addNotInterestedPost?: {
    __typename?: "ResponseBaseOfNotInterestedPost";
    status?: { code: number, value: string } | null;
  } | null;
};

export type NotInterestedPostInput = {
  id?: number;
  postId: number;
};

export type LikeComment_LikeCommentMutationVariables = Exact<{
  input?: InputMaybe<LikeCommentInput>;
}>;

export type LikeComment_LikeCommentMutation = {
  __typename?: "Mutation";
  likeComment_likeComment?: {
    __typename?: "ResponseBaseOfLikeComment";
    status?: { code: number, value: string } | null;
  } | null;
};

export type CommentInput = {
  commentType: CommentType;
  contentAddress?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["Int"]>;
  mentionId?: InputMaybe<Scalars["Int"]>;
  parentId?: InputMaybe<Scalars["Int"]>;
  postId: Scalars["Int"];
  text?: InputMaybe<Scalars["String"]>;
};

export type Follow_FollowUserMutationVariables = Exact<{
  followerInput?: InputMaybe<FollowerInput>;
}>;

export type Follow_FollowUserMutation = {
  __typename?: "Mutation";
  follow_followUser?: {
    __typename?: "ResponseBaseOfUserFollower";
    status?: { code: number, value: string } | null;
  } | null;
};

export type FollowerInput = {
  followedId?: number;
  followerId?: number;
};

export type Message_UpdateGroupMutationVariables = Exact<{
  input?: InputMaybe<GroupInput>;
}>;

export type Message_UpdateGroupMutation = {
  __typename?: "Mutation";
  message_updateGroup?: {
    __typename?: "ResponseStatus";
    code: number;
    value?: string | null;
  } | null;
};

export type GroupInput = {
  conversationId: Scalars["Int"];
  groupDescription?: InputMaybe<Scalars["String"]>;
  groupImgageUrl?: InputMaybe<Scalars["String"]>;
  groupLink?: InputMaybe<Scalars["String"]>;
  groupName: Scalars["String"];
  isPrivate: Scalars["Boolean"];
};
