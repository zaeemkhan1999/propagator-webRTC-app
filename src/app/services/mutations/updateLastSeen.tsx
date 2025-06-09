import { fetcher } from "@/graphql/fetcher";
import { enqueueSnackbar } from "notistack";

const UPDATE_LAST_SEEN_DOCUMENT = `
mutation user_updateLastSeen {
  user_updateLastSeen(){
    result{
      lastSeen
    }
    status
  }
}`;

type UpdateLastSeenResponse = {
    user_updateLastSeen: {
        result: {
            lastSeen: string;
        };
        status: {
            code: number;
            value: string;
        };
    };
};

const useUpdateLastSeen = () => {

    const updateLastSeen = async (
        onSuccess?: Function
    ) => {
        try {
            const addHistory = fetcher<
                UpdateLastSeenResponse,
                {}
            >(UPDATE_LAST_SEEN_DOCUMENT, {});
            const result = await addHistory();
            if (result?.user_updateLastSeen?.status?.code === 1) {
                onSuccess?.();
            };
        } catch (err: any) {
            enqueueSnackbar("Failed to Update Last Seen", { variant: "error", autoHideDuration: 3000 });
        };
    };

    return { updateLastSeen };
};

export default useUpdateLastSeen;
