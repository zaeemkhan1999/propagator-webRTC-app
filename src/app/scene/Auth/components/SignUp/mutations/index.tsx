import { useState } from "react";
import { fetcher } from "../../../../../../graphql/fetcher";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  Exact,
  InputMaybe,
  SignUpInput,
} from "../../../../../../types/general";

export type User_SignUpMutation = {
  __typename?: "Mutation";
  user_signUp?: {
    __typename?: "ResponseBaseOfInt32";
    status?: {
      code: number;
      value: string;
    } | null;
    result?: {
      access_Token: string;
      refresh_Token: string;
    } | null;
  } | null;
};

export type User_SignUpMutationVariables = Exact<{
  input?: InputMaybe<SignUpInput>;
}>;

const User_SignUpDocument = `
    mutation user_signUp($input: SignUpInput) {
      user_signUp(input: $input) {
      status
      result {
      access_Token
      refresh_Token
    }
  }
}
`;

export const useUser_SignUpMutation = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const signUp = async (variables: User_SignUpMutationVariables) => {
    setLoading(true);

    try {
      const signUpFetcher = fetcher<
        User_SignUpMutation,
        User_SignUpMutationVariables
      >(User_SignUpDocument, variables);

      const response = await signUpFetcher(); // Execute the fetcher

      const access_Token = response.user_signUp?.result?.access_Token || null;
      const refresh_Token = response.user_signUp?.result?.refresh_Token || null;

      if (access_Token && response.user_signUp?.status?.code && variables?.input) {
        navigate("/auth/security/?username=" + variables?.input?.username, { replace: true, state: { tokens: { access_Token, refresh_Token } } });
        enqueueSnackbar("Account created successfully", { variant: "success", autoHideDuration: 3000 });
      } else {
        enqueueSnackbar(response?.user_signUp?.status?.value, {
          variant: "error",
        });
      }
      return response;
    } catch (err: any) {
      enqueueSnackbar(err?.user_signUp?.status?.value, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading };
};
