import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";  // Assuming fetcher is correctly defined
import { useSnackbar } from "notistack";

const BAN_USER_MUTATION = `
  mutation user_banUser($userId: Int!, $isActive: Boolean!) {
    user_banUser(userId: $userId, isActive: $isActive) {
      result {
        id
        username
        displayName
        isActive
      }
      status
    }
  }
`;

interface BanUserInput {
    userId: number;
    isActive: boolean;
}

interface UserBanResponse {
    user_banUser: {
        result: {
            id: number;
            username: string;
            displayName: string;
            isActive: boolean;
        };
        status: any;
    };
}

export const useBanUser = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const banUnbanUser = async (
        variables: BanUserInput,
        onSuccessCallback?: (updatedUser: { id: number; username: string; isActive: boolean }) => void
    ) => {
        setLoading(true);

        try {
            const getData = fetcher<UserBanResponse, BanUserInput>(BAN_USER_MUTATION, variables);

            const result = await getData();

            if (result.user_banUser.status) {
                enqueueSnackbar(`User ${variables.isActive ? 'Unbanned' : 'Banned'} successfully`, {
                    variant: "success",
                    autoHideDuration: 2000,
                });

                onSuccessCallback?.(result.user_banUser.result);
            } else {
                enqueueSnackbar(`Failed to ${variables.isActive ? 'Unban' : 'Ban'} user`, {
                    variant: "error",
                    autoHideDuration: 2000,
                });
            }
        } catch (err: any) {
            enqueueSnackbar("An error occurred while updating user role", {
                variant: "error",
                autoHideDuration: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    return { banUnbanUser, loading };
};
