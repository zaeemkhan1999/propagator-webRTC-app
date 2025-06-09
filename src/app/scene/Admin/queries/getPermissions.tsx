import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

// The GraphQL query document
const GET_PERMISSIONS_DOCUMENT = `
  query permissions_getPermissions($username: String, $skip: Int, $take: Int, $where: UserClaimsViewModelFilterInput, $order: [UserClaimsViewModelSortInput!]) {
    permissions_getPermissions(username: $username) {
      result(skip: $skip, take: $take, where: $where, order: $order) {
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

interface Permissions_GetPermissionsQueryVariables {
    username: string;
    skip: number;
    take: number;
}

export interface Permissions_GetPermissionsQuery {
    permissions_getPermissions: {
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

export const useGetPermissions = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<Permissions_GetPermissionsQuery | null>(null);

    const getPermissions = async (
        variables: Permissions_GetPermissionsQueryVariables,
        onSuccessCallback?: (p: [] | UserPermissions[]) => void
    ) => {
        setLoading(true);
        setError(null);

        try {
            const getData = fetcher<
                Permissions_GetPermissionsQuery,
                Permissions_GetPermissionsQueryVariables
            >(GET_PERMISSIONS_DOCUMENT, variables);
            const result = await getData();
            setData(result);

            if (result.permissions_getPermissions.status.code === 1) {
                onSuccessCallback?.(result.permissions_getPermissions.result.items);
            } else {
                enqueueSnackbar(result.permissions_getPermissions.status.value
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
