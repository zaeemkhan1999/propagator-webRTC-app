import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

// The GraphQL query document
const GET_CURRENT_USER_PERMISSIONS_DOCUMENT = `
  query permissions_getCurrentUserPermissions($skip: Int, $take: Int) {
    permissions_getCurrentUserPermissions() {
      result(skip: $skip, take: $take) {
        items {
          selected
          type
          value
        }
        totalCount
      }
      status
    }
  }
`;

interface Permissions_GetCurrentUserPermissionsQueryVariables {
    skip: number;
    take: number;
}

export interface Permissions_GetCurrentUserPermissionsQuery {
    permissions_getCurrentUserPermissions: {
        result: {
            items: {
                selected: boolean;
                type: string;
                value: string;
            }[];
            totalCount: number;
        };
        status: {
            code: number;
            value: string;
        };
    };
}

export interface UserPermissions {
    value: string;
    selected: boolean;
    type: string;
}

export const useGetCurrentUserPermissions = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<Permissions_GetCurrentUserPermissionsQuery | null>(null);

    const getPermissions = async (
        variables: Permissions_GetCurrentUserPermissionsQueryVariables,
        onSuccessCallback?: (p: [] | UserPermissions[]) => void
    ) => {
        setLoading(true);
        setError(null);

        try {
            const getData = fetcher<
                Permissions_GetCurrentUserPermissionsQuery,
                Permissions_GetCurrentUserPermissionsQueryVariables
            >(GET_CURRENT_USER_PERMISSIONS_DOCUMENT, variables);
            const result = await getData();
            setData(result);

            if (result.permissions_getCurrentUserPermissions.status.code === 1) {
                onSuccessCallback?.(result.permissions_getCurrentUserPermissions.result.items);
            } else {
                enqueueSnackbar(result.permissions_getCurrentUserPermissions.status.value
                    || "Failed to fetch permissions", { variant: 'error', autoHideDuration: 2000 });
            }
        } catch (err: any) {
            setError(err);
            enqueueSnackbar("An error occurred while fetching permissions", { variant: 'error', autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return { getPermissions, loading, error, data };
};
