import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";
import { UserPermissions } from "../queries/getPermissions";

const UPDATE_PERMISSION_DOCUMENT = `
  mutation permission_updatePermission($input: PermissionInput, $take: Int) {
    permission_updatePermission(input: $input) {
      result(take: $take) {
        items {
          value
          type
          selected
        }
      }
      status
    }
  }
`;

interface PermissionInput {
    username: string;
    userClaims: {
        type: string;
        selected: boolean;
        value: string;
    }[];
}

interface Permission_UpdatePermissionMutationVariables {
    input: PermissionInput;
    take: number;
}

interface Permission_UpdatePermissionMutation {
    permission_updatePermission: {
        result: {
            items: UserPermissions[];
        };
        status: {
            code: number;
            value: string;
        }
    };
}

export const useUpdatePermission = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const updatePermission = async (
        variables: Permission_UpdatePermissionMutationVariables,
        onSuccessCallback?: (newPermissions: UserPermissions[] | []) => void
    ) => {
        setLoading(true);

        try {
            const getData = fetcher<
                Permission_UpdatePermissionMutation,
                Permission_UpdatePermissionMutationVariables
            >(UPDATE_PERMISSION_DOCUMENT, variables);

            const result = await getData();

            if (result.permission_updatePermission.status.code === 1) {
                enqueueSnackbar("Permissions updated successfully", { variant: "success", autoHideDuration: 2000 });
                onSuccessCallback?.(result.permission_updatePermission.result.items || []);
            } else {
                enqueueSnackbar("Failed to update permissions", { variant: "error", autoHideDuration: 2000 });
            }
        } catch (err: any) {
            enqueueSnackbar("An error occurred while updating permissions", { variant: "error", autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return { updatePermission, loading };
};
