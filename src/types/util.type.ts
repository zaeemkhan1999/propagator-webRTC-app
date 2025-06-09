export type DayOfWeekType =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";
export type WorkingTimeInput_InputType = {
  startHoure: string;
  endHoure: string;
  dayOfWeek: DayOfWeekType;
  hospitalId?: number;
  medicalBeautyCenterId?: number;
  clinicName?: string;
};

export type GenderType = "MALE" | "FEMALE";

export type LanguageType = "ENGLISH" | "ARABIC" | "KURDI";

export type InfoReviewStatus = "WAITING" | "CONFIRMED" | "REJECTED";

export type CollectionSegmentInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type User = {
  id?: number;
  isDeleted?: boolean;
  createdDate?: string;
  lastModifiedDate?: any;
  externalId?: any;
  linkBio?: any;
  email?: string;
  stripeAccountId?: any;
  stripeCustomerId?: any;
  isActive?: boolean;
  isDeletedAccount?: boolean;
  userTypes?: string;
  bio?: any;
  displayName?: string;
  username: string;
  dateOfBirth?: string;
  phoneNumber?: any;
  countryCode?: any;
  phoneNumberConfirmed?: boolean;
  isVerified?: boolean;
  imageAddress?: any;
  cover?: any;
  gender?: string;
  location?: any;
  directNotification?: boolean;
  followeBacknotification?: boolean;
  likeNotification?: boolean;
  commentNotification?: boolean;
  enableTwoFactorAuthentication?: boolean;
  privateAccount?: boolean;
  professionalAccount?: boolean;
  follwingCount?: number;
  followerCount?: number;
  postCount?: number;
  lastSeen?: string;
};
