import { User } from "@/types/util.type";
import { useState } from "react";
import { getToken } from "@/http/graphql.client";
import config from "@/config/index.dev";
import { enqueueSnackbar } from "notistack";

const GET_USER_BY_ID = `
 query user_getUserByIdDto ($userId: Int!
 $currentUserId: Int!) {
  user_getUserByIdDto (userId: $userId, currentUserId: $currentUserId){
    result {
      isFollowing
      contentCount
      followerCount
      follwingCount
      user{
        id
        username
        imageAddress
        displayName
        cover
        lastSeen
      }
    }
    status
  }
}
`;

type Response = {
  isFollowing: boolean;
  contentCount: number;
  followerCount: number;
  follwingCount: number;
  user: User;
};

export const useGetUserInfoById = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [data, setData] = useState<Response | null>(null);

  const getData = async (userId: number, currentUserId: number) => {
    try {
      setIsFetched(false);
      setIsLoading(true);
      const response = await fetch(config.apiUrl + '/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          query: GET_USER_BY_ID,
          variables: {
            userId,
            currentUserId
          },
        }),
      });

      if (!response.ok) {
        enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
      };

      const json = await response.json();
      setData(json?.data?.user_getUserByIdDto?.result || null);
    } catch (err) {
      enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
      throw err;
    } finally {
      setIsFetched(true);
      setIsLoading(false);
    };
  };

  return {
    isLoading,
    isFetched,
    data,
    setData,
    getData,
  };
};

export default useGetUserInfoById;
