import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";  // Assuming fetcher is correctly defined
import { useSnackbar } from "notistack";

const SET_ADMIN_MUTATION = `
  mutation user_setAsAdministrator($userId: Int!, $userTypes: UserTypes!) {
    user_setAsAdministrator(userId: $userId, userTypes: $userTypes) {
      result {
        id
        username
        displayName
        userTypes
      }
      status
    }
  }
`;

interface SetAdminInput {
    userId: number;
    userTypes: "ADMIN" | "USER" | "SUPER_ADMIN";
}

interface UserSetAdminResponse {
    user_setAsAdministrator: {
        result: {
            id: number;
            username: string;
            displayName: string;
            userTypes: string;
        };
        status: { code: number; value: string };
    };
}

export const useSetAsAdministrator = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const grantOrRevokeAdminAccess = async (
        variables: SetAdminInput,
        onSuccessCallback?: (updatedUser: { id: number; username: string; userTypes: string }) => void
    ) => {
        setLoading(true);

        try {
            const getData = fetcher<UserSetAdminResponse, SetAdminInput>(SET_ADMIN_MUTATION, variables);
            const result = await getData();

            if (result.user_setAsAdministrator.status) {
                enqueueSnackbar(`Admin Access ${variables.userTypes === 'ADMIN' ? 'Granted' : 'Revoked'} successfully`, {
                    variant: "success",
                    autoHideDuration: 2000,
                });

                onSuccessCallback?.(result.user_setAsAdministrator.result);
            } else {
                enqueueSnackbar(`Failed to update user as ${variables.userTypes}`, {
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

    return { grantOrRevokeAdminAccess, loading };
};
