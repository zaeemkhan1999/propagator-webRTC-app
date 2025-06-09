import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { fetcher } from "../../../../graphql/fetcher";

// GraphQL mutation document for creating a user search account
export const UserSearchAccount_CreateMutationDocument = `
  mutation userSearchAccount_createUserSearchAccount($input: UserSearchAccountInput!) {
    userSearchAccount_createUserSearchAccount(input: $input) {
      result {
        searchedId
        searcherId
        id
      }
      status
    }
  }
`;

// TypeScript interfaces for response and variables
interface UserSearchAccountInput {
    searchedName: string;
}

interface UserSearchAccountCreateResult {
    searchedName: string;
    searcherId: number;
    id: number;
}

interface UserSearchAccountCreateMutationResponse {
    userSearchAccount_createUserSearchAccount: {
        result: UserSearchAccountCreateResult;
        status: string;
    };
}

interface UserSearchAccountCreateMutationVariables {
    input: UserSearchAccountInput;
}

// Custom hook for creating a user search account
export const useCreateUserSearchAccount = (
    options?: UseMutationOptions<
        UserSearchAccountCreateMutationResponse,
        Error,
        UserSearchAccountCreateMutationVariables
    >
) =>
    useMutation<UserSearchAccountCreateMutationResponse, Error, UserSearchAccountCreateMutationVariables>({
        mutationKey: ["userSearchAccount_createUserSearchAccount"],
        mutationFn: (variables) =>
            fetcher<UserSearchAccountCreateMutationResponse, UserSearchAccountCreateMutationVariables>(
                UserSearchAccount_CreateMutationDocument,
                variables
            )(),
        ...options,
    });