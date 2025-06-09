import { useState } from "react";
import { fetcher } from "../../../../../../graphql/fetcher";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { InputMaybe, LoginInput } from "../../../../../../types/general";
import { userStore } from "../../../../../../store/user";

export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};

export type User_LoginMutationVariables = Exact<{
  input?: InputMaybe<LoginInput>;
}>;

export type User_LoginMutation = {
  __typename?: "Mutation";
  user_login?: {
    __typename?: "ResponseBaseOfTokens";
    status?: { code: number, value: string } | null;
    result?: {
      __typename?: "Tokens";
      access_Token?: string | null;
      refresh_Token?: string | null;
    } | null;
  } | null;
};

// The login mutation GraphQL query
const User_LoginDocument = `
    mutation user_login($input: LoginInput) {
  user_login(input: $input) {
    result {
      access_Token
      refresh_Token
    }
    status
  }
}
`;

// TODO: use react-query
export const useUser_LoginMutation = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<User_LoginMutation | null>(null);

  const login = async (variables: User_LoginMutationVariables) => {
    setLoading(true);
    setError(null);

    try {
      const loginFetcher = fetcher<
        User_LoginMutation,
        User_LoginMutationVariables
      >(User_LoginDocument, variables);
      const response = await loginFetcher();

      const access_Token = response.user_login?.result?.access_Token || null;
      const refresh_Token = response.user_login?.result?.refresh_Token || null;
      userStore.actions.setToken(access_Token, refresh_Token);

      if (access_Token) {
        userStore.store.authentication.status = "loggedIn";
        navigate("/specter/home", { replace: true });
      } else {
        enqueueSnackbar("The username or password entered is incorrect.", {
          variant: "error",
        });
      }
      setData(response); // Store the response data
    } catch (err: any) {
      setError(err); // Handle the error
      enqueueSnackbar(err?.user_login?.status?.value, {
        variant: "error",
        autoHideDuration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, data };
};
