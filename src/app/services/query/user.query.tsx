import { useState } from "react";
import { fetcher } from "../../../graphql/fetcher";
import { userStore } from "../../../store/user";
import { User } from "@/types/util.type";

const USER_GET_CURRENT_USER_DOCUMENT = `
  query User_getCurrentUser {
    user_getCurrentUser {
      status
      result {
        id
        isDeleted
        createdDate
        lastModifiedDate
        externalId
        linkBio
        email
        stripeAccountId
        stripeCustomerId
        isActive
        isDeletedAccount
        userTypes
        bio
        displayName
        username
        dateOfBirth
        phoneNumber
        countryCode
        phoneNumberConfirmed
        isVerified
        imageAddress
        cover
        gender
        location
        directNotification
        followeBacknotification
        likeNotification
        commentNotification
        enableTwoFactorAuthentication
        privateAccount
        professionalAccount
        follwingCount
        followerCount
        postCount
      }
    }
  }
`;

// TODO: use react query.
export const useGetCurrentUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<User | null>(null);

  const fetchCurrentUser = async (onSuccess?: (user: User | null) => void) => {
    setLoading(true);
    setError(null);

    try {
      const getData = fetcher<any, any>(USER_GET_CURRENT_USER_DOCUMENT);
      const response = await getData();
      const user = response?.user_getCurrentUser?.result;
      userStore.actions.setUser(user);

      setData(user);
      user && onSuccess?.(user);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { fetchCurrentUser, loading, error, data };
};
