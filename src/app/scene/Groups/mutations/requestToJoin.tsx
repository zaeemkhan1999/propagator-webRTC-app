import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { enqueueSnackbar } from "notistack";

const REQUEST_TO_JOIN_DOCUMENT = `
mutation groupRequest_RequestToJoin($groupId: Int!){
 groupRequest_RequestToJoin(groupId: $groupId){
  status
 }
}
`;

type RequestToJoinResponse = {
    groupRequest_RequestToJoin: {
        status: {
            code: number;
            value: string;
        };
    };
};

type RequestToJoinVariables = {
    groupId: number;
};

export const useRequestToJoinGroup = () => {
    const [loading, setLoading] = useState(false);

    const requestToJoin = async (
        variables: RequestToJoinVariables,
        onSuccess?: Function
    ) => {
        setLoading(true);
        try {
            const addRequest = fetcher<
                RequestToJoinResponse,
                RequestToJoinVariables
            >(REQUEST_TO_JOIN_DOCUMENT, variables);
            const result = await addRequest();
            if (result?.groupRequest_RequestToJoin?.status?.code === 1) {
                enqueueSnackbar(result?.groupRequest_RequestToJoin?.status?.value, { variant: "success", autoHideDuration: 3000 });
                onSuccess?.();
            };
        } catch (err: any) {
            enqueueSnackbar(err?.groupRequest_RequestToJoin?.status?.value || "Something went wrong", { variant: "error", autoHideDuration: 3000 });
        } finally {
            setLoading(false);
        };
    };

    return { requestToJoin, loading };
};
