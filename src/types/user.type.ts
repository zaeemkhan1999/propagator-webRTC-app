import { ResStatusType } from "./graphql.type";
import { CollectionSegmentInfo } from "./util.type";

export type ProviderNameType =
  | "USER"
  | "DOCTOR"
  | "CLINIC"
  | "HOSPITAL"
  | "LAB"
  | "PHARMACY"
  | "DENTIST"
  | "MEDICAL_BEAUTY_CENTER"
  | "VETERINARIAN"
  | "NUTRITION_EXPERT"
  | "HOME_SERVICE"
  | "AMBULANCE";

export enum UserTypes {
  Admin = "ADMIN",
  SuperAdmin = "SUPER_ADMIN",
  User = "USER",
}

export type UserType = {
  email?: string;
  lastSeen: Date;
  userTypes: UserTypes;
  name?: string;
  phoneNumber?: string;
  address?: string;
  gender: string;
  imageAddress?: string;
  starts: number;
  rejectReason?: string;
  notifications?: [Notification];
  externalId?: string;
  id: number;
  isDeleted: boolean;
  createdDate: Date;
  professionalAccount: boolean;
  bio?: string;
  fullName?: string;
  username?: string;
  dateOfBirth?: string;
  location?: string;
  enableTwoFactorAuthentication?: boolean;
  countryCode?: string;
  privateAccount?: boolean;
  directNotification?: boolean;
  followeBacknotification?: boolean;
  likeNotification?: boolean;
  commentNotification?: boolean;
  isVeriefied?: boolean;
  linkBio?: string;
  displayName?: string;
  isVerified?: boolean;
  follwingCount?: number;
  followerCount?: number;
  cover?: any;
};

export type LoginType = "GOOGLE" | "FACE_BOOK";

export type ResponseBaseOfUser = {
  result: UserType;
  status: ResStatusType;
};

export type UserCollectionSegment = {
  items: Array<UserType>;
  pageInfo: CollectionSegmentInfo;
  totalCount: number;
};
