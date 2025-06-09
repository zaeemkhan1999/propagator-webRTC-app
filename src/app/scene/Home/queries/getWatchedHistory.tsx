import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

const GET_WATCHED_HISTORY_DOCUMENT = `
  query post_GetWatchedHistory {
    post_GetWatchedHistory {
      result {
          isLiked
          isNotInterested
          isSaved
          isYourPost
          isViewed
          commentCount
          shareCount
          viewCount
          likeCount
          post {
            deletedBy
            isPromote
            bg
            aspectRatio
            postItemsString
            id
            duration
            location
            yourMind
            createdDate
            allowDownload
            iconLayoutType
            isCreatedInGroup
            poster {
              id
              username
              imageAddress
              displayName
            }
          }
      }
      status
    }
  }
`;

interface Post_GetWatchedHistoryResponse {
  post_GetWatchedHistory: {
    result: Result[];
    status: {
      code: number;
      value: string;
    };
  };
};

interface Result {
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
    id: number;
    deletedBy: string
    isPromote: boolean;
    bg: string;
    aspectRatio: string;
    postItemsString: string;
    duration: string;
    location: string;
    postedAt: string;
    yourMind: string;
    createdDate: string;
    allowDownload: boolean;
    iconLayoutType: string;
    isPin: boolean;
    isCreatedInGroup: boolean;
    poster: {
      id: string;
      username: string;
      imageAddress: string;
      displayName: string;
    };
  };
};

const useGetWatchedHistory = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Result[]>([]);

  const getWatchedHistory = async () => {
    setLoading(true);

    try {
      const getData = fetcher<Post_GetWatchedHistoryResponse, {}>(GET_WATCHED_HISTORY_DOCUMENT, {});
      const result = await getData();
      setData(result?.post_GetWatchedHistory?.result);

      if (result?.post_GetWatchedHistory?.status?.code !== 1) {
        enqueueSnackbar(result?.post_GetWatchedHistory?.status?.value || "Failed to fetch watched history", { variant: 'error', autoHideDuration: 3000 });
      };
    } catch (err: any) {
      enqueueSnackbar(err?.post_GetWatchedHistory?.status?.value || "Failed to fetch watched history", { variant: 'error', autoHideDuration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return { getWatchedHistory, loading, data, setData };
};

export default useGetWatchedHistory;
