import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { enqueueSnackbar } from "notistack";

const REMOVE_MESSAGE_DOCUMENT = `
mutation message_removeMessage ($messageId: Int!){
  message_removeMessage(messageId: $messageId){
    code
    value
  }
}
`;

interface RemoveMessageResponse {
    message_removeMessage: {
        code: number;
        value: string;
    };
};

const useRemoveMessage = () => {

    const [loading, setLoading] = useState(false);

    const removeMessage = async (
        messageId: number,
        onSuccessCallback?: () => void
    ) => {
        try {
            setLoading(true);
            const remove = fetcher<
                RemoveMessageResponse,
                { messageId: number }
            >(REMOVE_MESSAGE_DOCUMENT, { messageId });

            const result = await remove();

            if (result?.message_removeMessage?.code === 1) {
                enqueueSnackbar(result?.message_removeMessage?.value, { variant: 'success', autoHideDuration: 3000, anchorOrigin: { horizontal: "left", vertical: "top" } });
                onSuccessCallback?.();
            } else {
                enqueueSnackbar(result?.message_removeMessage?.value, { variant: 'error', autoHideDuration: 3000, anchorOrigin: { horizontal: "left", vertical: "top" } });
            };
        } catch (err: any) {
            enqueueSnackbar(err?.message_removeMessage?.value, { variant: 'error', autoHideDuration: 3000, anchorOrigin: { horizontal: "left", vertical: "top" } });
        } finally {
            setLoading(false);
        };
    };

    return { removeMessage, loading };
};

export default useRemoveMessage;
