import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

const REQUEST_TO_JOIN_DOCUMENT = `
mutation groupRequest_ApproveUser($groupId: Int!, $userId: Int!){
  groupRequest_ApproveUser(groupId: $groupId, userId: $userId){
    status
  }
 }
`;

type ApproveRequestResponse = {
    groupRequest_ApproveUser: {
        status: {
            code: number;
            value: string;
        };
    };
};

type ApproveRequestVariables = {
    groupId: number;
    userId: number;
};

export const useApproveRequest = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const approveRequest = async (
        variables: ApproveRequestVariables,
        onSuccess?: Function
    ) => {
        setLoading(true);
        try {
            const addRequest = fetcher<
                ApproveRequestResponse,
                ApproveRequestVariables
            >(REQUEST_TO_JOIN_DOCUMENT, variables);
            const result = await addRequest();
            if (result?.groupRequest_ApproveUser?.status?.code === 1) {
                enqueueSnackbar(result?.groupRequest_ApproveUser?.status?.value, { variant: "success", autoHideDuration: 3000 });
                onSuccess?.();
            };
        } catch (err: any) {
            enqueueSnackbar(err?.groupRequest_ApproveUser?.status?.value || "Something went wrong", { variant: "error", autoHideDuration: 3000 });
        } finally {
            setLoading(false);
        };
    };

    return { approveRequest, loading };
};
