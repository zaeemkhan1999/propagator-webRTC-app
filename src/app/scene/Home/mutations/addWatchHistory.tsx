import { fetcher } from "../../../../graphql/fetcher";
// import { enqueueSnackbar } from "notistack";

const ADD_WATCH_HISTORY_DOCUMENT = `
mutation post_addWatchHistory($postIds: [Int!]){
 post_addWatchHistory(postIds: $postIds){
  status
 }
}
`;

type AddWatchHistoryResponse = {
    post_addWatchHistory: {
        status: {
            code: number;
            value: string;
        };
    };
};

const useAddWatchHistory = () => {

    const addWatchHistory = async (
        { postIds }: { postIds: number[] },
        onSuccess?: Function
    ) => {
        try {
            const addHistory = fetcher<
                AddWatchHistoryResponse,
                { postIds: number[] }
            >(ADD_WATCH_HISTORY_DOCUMENT, { postIds });
            const result = await addHistory();
            if (result?.post_addWatchHistory?.status?.code === 1) {
                onSuccess?.();
            };
        } catch (err: any) {
            // enqueueSnackbar("Failed to Add Watch History", { variant: "error", autoHideDuration: 3000 });
        };
    };

    return { addWatchHistory };
};

export default useAddWatchHistory;
